<?php

namespace App\Services\TeacherDiscovery;

use App\Models\TeacherDiscoverySearch;
use App\Models\TeacherDiscoverySetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TeacherDataExtractionService
{
    private const KNOWN_SUBJECTS = [
        'Mathematics', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Science',
        'English', 'Hindi', 'Bengali', 'History', 'Geography', 'Economics',
        'Accountancy', 'Commerce', 'Computer Science', 'Coding', 'Python',
        'Social Studies', 'Political Science', 'Statistics', 'JEE', 'NEET',
        'UPSC', 'Sanskrit', 'French', 'German', 'Music', 'Art',
    ];

    private const KNOWN_QUALIFICATIONS = [
        'Ph.D', 'PhD', 'M.Tech', 'B.Tech', 'M.Sc', 'B.Sc', 'M.A', 'B.A',
        'M.Com', 'B.Com', 'B.Ed', 'M.Ed', 'MBA', 'MCA', 'BCA', 'MBBS', 'LLB', 'NET', 'SET',
    ];

    /**
     * Extract strictly publicly available professional information from a search hit.
     * Respects robots.txt and never fabricates missing fields (unavailable fields remain NULL).
     */
    public function extract(array $searchItem, TeacherDiscoverySearch $search, TeacherDiscoverySetting $settings): array
    {
        $url = trim((string)($searchItem['url'] ?? ''));
        $title = trim((string)($searchItem['title'] ?? ''));
        $snippet = trim((string)($searchItem['snippet'] ?? ''));
        $sourceName = $searchItem['source_name'] ?? (parse_url($url, PHP_URL_HOST) ?: 'Web');

        $html = null;
        $pageAllowed = true;

        if ($url !== '' && filter_var($url, FILTER_VALIDATE_URL)) {
            if ($settings->respect_robots_txt) {
                $pageAllowed = $this->isAllowedByRobotsTxt($url, max(5, (int)$settings->timeout_seconds));
            }

            if ($pageAllowed) {
                $html = $this->fetchPublicPage($url, min(10, max(4, (int)$settings->timeout_seconds)));
            }
        }

        $jsonLd = $html ? $this->extractPersonJsonLd($html) : [];
        $ogImage = $html ? $this->extractMetaTag($html, 'og:image') : null;
        $metaDesc = $html ? ($this->extractMetaTag($html, 'description') ?: $this->extractMetaTag($html, 'og:description')) : null;
        $plainText = $html ? $this->stripHtmlToText($html) : '';

        // Combine snippet + visible text (capped to avoid noise)
        $combinedText = trim($title . ' ' . $snippet . ' ' . mb_substr($plainText, 0, 6000));

        // 1. Name (from JSON-LD Person name, or clean title segment)
        $teacherName = $jsonLd['name'] ?? $this->extractNameFromTitle($title);
        if (empty($teacherName)) {
            $teacherName = mb_substr($title ?: $sourceName, 0, 120);
        }

        // 2. Email (only if explicitly published on page/snippet)
        $email = $jsonLd['email'] ?? $this->extractEmail($combinedText);

        // 3. Phone & WhatsApp (only if explicitly published)
        $phone = $jsonLd['telephone'] ?? $this->extractPhone($combinedText);
        $whatsapp = $this->extractWhatsApp($combinedText);

        // 4. Gender (only if explicitly published)
        $gender = $jsonLd['gender'] ?? $this->extractGender($combinedText);

        // 5. Subjects (matched against known subjects mentioned in text)
        $subjects = $this->extractSubjects($combinedText, $search->subject);

        // 6. Qualification, Experience, Teaching Mode, Fees
        $qualification = $this->extractQualification($combinedText);
        $experience = $this->extractExperience($combinedText);
        $teachingMode = $this->extractTeachingMode($combinedText);
        $hourlyFees = $this->extractFees($combinedText);
        $availableClasses = $this->extractClasses($combinedText);
        $instituteName = $jsonLd['worksFor'] ?? null;

        // 7. Biography (strictly from published snippet or meta description)
        $biography = $jsonLd['description'] ?? ($snippet ?: $metaDesc);
        $biography = $biography ? trim(strip_tags($biography)) : null;

        // 8. Profile Image
        $profileImage = $jsonLd['image'] ?? ($searchItem['image'] ?? $ogImage);
        if (is_array($profileImage)) {
            $profileImage = $profileImage['url'] ?? ($profileImage[0] ?? null);
        }

        return [
            'teacher_name'               => trim($teacherName),
            'profile_image'              => is_string($profileImage) && filter_var($profileImage, FILTER_VALIDATE_URL) ? $profileImage : null,
            'gender'                     => $gender,
            'email'                      => $email,
            'phone'                      => $phone,
            'whatsapp'                   => $whatsapp,
            'country'                    => $search->country ?: 'India',
            'state'                      => $search->state ?: null,
            'city'                       => $search->city ?: null,
            'locality'                   => $search->locality ?: null,
            'full_address'               => $jsonLd['address'] ?? null,
            'subjects'                   => !empty($subjects) ? $subjects : null,
            'qualification'              => $qualification,
            'specialization'             => $search->subject ?: (!empty($subjects) ? $subjects[0] : null),
            'experience'                 => $experience,
            'teaching_mode'              => $teachingMode,
            'available_classes'          => $availableClasses,
            'hourly_fees'                => $hourlyFees,
            'institute_name'             => $instituteName,
            'biography'                  => $biography,
            'source_name'                => $sourceName,
            'source_url'                 => $url ?: null,
            'source_url_hash'            => $url ? hash('sha256', rtrim(strtolower($url), '/')) : null,
            'source_verification_status' => $pageAllowed ? ($html ? 'public_fetched' : 'snippet_only') : 'robots_restricted_snippet_only',
            'raw_data'                   => [
                'search_item' => $searchItem['raw'] ?? $searchItem,
                'robots_ok'   => $pageAllowed,
            ],
        ];
    }

    /**
     * Respect robots.txt for the target host before fetching page HTML.
     */
    private function isAllowedByRobotsTxt(string $url, int $timeout): bool
    {
        $parsed = parse_url($url);
        if (empty($parsed['scheme']) || empty($parsed['host'])) {
            return false;
        }

        $hostKey = 'robots_txt:' . strtolower($parsed['host']);
        $robotsTxt = Cache::remember($hostKey, 21600, function () use ($parsed, $timeout) {
            try {
                $robotsUrl = $parsed['scheme'] . '://' . $parsed['host'] . '/robots.txt';
                $res = Http::timeout(min(5, $timeout))
                    ->withUserAgent('TheLocalTutorsBot/1.0 (+https://thelocaltutors.com)')
                    ->get($robotsUrl);
                return $res->successful() ? $res->body() : '';
            } catch (\Throwable $e) {
                return '';
            }
        });

        if (empty($robotsTxt)) {
            return true;
        }

        $path = $parsed['path'] ?? '/';
        $lines = preg_split('/\r\n|\r|\n/', $robotsTxt);
        $appliesToAll = false;

        foreach ($lines as $line) {
            $line = trim(preg_replace('/#.*$/', '', $line));
            if ($line === '') continue;

            if (stripos($line, 'User-agent:') === 0) {
                $agent = trim(substr($line, 11));
                $appliesToAll = ($agent === '*' || stripos($agent, 'TheLocalTutorsBot') !== false);
                continue;
            }

            if ($appliesToAll && stripos($line, 'Disallow:') === 0) {
                $disallowed = trim(substr($line, 9));
                if ($disallowed === '/') {
                    return false;
                }
                if ($disallowed !== '' && str_starts_with($path, $disallowed)) {
                    return false;
                }
            }
        }

        return true;
    }

    private function fetchPublicPage(string $url, int $timeout): ?string
    {
        try {
            $res = Http::timeout($timeout)
                ->withUserAgent('TheLocalTutorsBot/1.0 (+https://thelocaltutors.com)')
                ->withHeaders(['Accept' => 'text/html,application/xhtml+xml'])
                ->get($url);

            // Never attempt to bypass 401/403/429/paywalls
            if (!$res->successful()) {
                return null;
            }

            $contentType = (string)$res->header('Content-Type');
            if ($contentType !== '' && stripos($contentType, 'text/html') === false) {
                return null;
            }

            return $res->body();
        } catch (\Throwable $e) {
            Log::debug("TeacherDiscovery page fetch skipped for {$url}: " . $e->getMessage());
            return null;
        }
    }

    private function extractPersonJsonLd(string $html): array
    {
        $out = [];
        if (!preg_match_all('/<script[^>]+type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/is', $html, $matches)) {
            return $out;
        }

        foreach ($matches[1] as $rawJson) {
            $decoded = json_decode(trim($rawJson), true);
            if (!is_array($decoded)) continue;

            $nodes = isset($decoded['@graph']) && is_array($decoded['@graph']) ? $decoded['@graph'] : [$decoded];
            foreach ($nodes as $node) {
                if (!is_array($node)) continue;
                $type = $node['@type'] ?? '';
                if (is_array($type)) $type = implode(',', $type);
                if (stripos((string)$type, 'Person') === false) continue;

                if (!empty($node['name']) && is_string($node['name'])) $out['name'] = trim($node['name']);
                if (!empty($node['email']) && is_string($node['email'])) $out['email'] = str_replace('mailto:', '', trim($node['email']));
                if (!empty($node['telephone']) && is_string($node['telephone'])) $out['telephone'] = trim($node['telephone']);
                if (!empty($node['gender']) && is_string($node['gender'])) $out['gender'] = ucfirst(strtolower(trim($node['gender'])));
                if (!empty($node['description']) && is_string($node['description'])) $out['description'] = trim($node['description']);
                if (!empty($node['image'])) $out['image'] = $node['image'];
                if (!empty($node['worksFor']['name'])) $out['worksFor'] = trim((string)$node['worksFor']['name']);
                if (!empty($node['address']['streetAddress'])) $out['address'] = trim((string)$node['address']['streetAddress']);
                break 2;
            }
        }

        return $out;
    }

    private function extractMetaTag(string $html, string $name): ?string
    {
        $pattern = '/<meta[^>]+(?:name|property)=["\']' . preg_quote($name, '/') . '["\'][^>]+content=["\']([^"\']+)["\']/i';
        if (preg_match($pattern, $html, $m)) {
            return html_entity_decode(trim($m[1]), ENT_QUOTES, 'UTF-8');
        }
        return null;
    }

    private function stripHtmlToText(string $html): string
    {
        $clean = preg_replace('/<(script|style|noscript|svg|header|footer|nav)\b[^>]*>.*?<\/\1>/is', ' ', $html);
        $clean = strip_tags((string)$clean);
        return trim(preg_replace('/\s+/', ' ', html_entity_decode($clean, ENT_QUOTES, 'UTF-8')));
    }

    private function extractNameFromTitle(string $title): string
    {
        $parts = preg_split('/\s*[\|\-–—:]\s*/', $title);
        return trim($parts[0] ?? $title);
    }

    private function extractEmail(string $text): ?string
    {
        if (preg_match('/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/', $text, $m)) {
            $email = strtolower($m[0]);
            // Ignore generic placeholder/support emails
            if (!preg_match('/^(noreply|no-reply|support|info|admin|contact|privacy|example)@/i', $email)) {
                return $email;
            }
        }
        return null;
    }

    private function extractPhone(string $text): ?string
    {
        if (preg_match('/(?:\+91[\-\s]?)?([6-9]\d{9})\b/', $text, $m)) {
            return $m[1];
        }
        return null;
    }

    private function extractWhatsApp(string $text): ?string
    {
        if (preg_match('/whatsapp[^0-9]{0,20}(?:\+91[\-\s]?)?([6-9]\d{9})\b/i', $text, $m)) {
            return $m[1];
        }
        return null;
    }

    private function extractGender(string $text): ?string
    {
        if (preg_match('/\bgender\s*[:\-]\s*(male|female|other)\b/i', $text, $m)) {
            return ucfirst(strtolower($m[1]));
        }
        return null;
    }

    private function extractSubjects(string $text, ?string $preferredSubject = null): array
    {
        $found = [];
        foreach (self::KNOWN_SUBJECTS as $sub) {
            if (preg_match('/\b' . preg_quote($sub, '/') . '\b/i', $text)) {
                $found[] = $sub === 'Maths' ? 'Mathematics' : $sub;
            }
        }
        if ($preferredSubject && empty($found) && stripos($text, $preferredSubject) !== false) {
            $found[] = $preferredSubject;
        }
        return array_values(array_unique($found));
    }

    private function extractQualification(string $text): ?string
    {
        $found = [];
        foreach (self::KNOWN_QUALIFICATIONS as $qual) {
            if (preg_match('/\b' . preg_quote($qual, '/') . '\b/i', $text)) {
                $found[] = $qual;
            }
        }
        return !empty($found) ? implode(', ', array_slice(array_unique($found), 0, 3)) : null;
    }

    private function extractExperience(string $text): ?string
    {
        if (preg_match('/\b(\d{1,2})\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:teaching\s*)?experience\b/i', $text, $m)) {
            return $m[1] . ' Years';
        }
        return null;
    }

    private function extractTeachingMode(string $text): ?string
    {
        $hasOnline = (bool)preg_match('/\bonline\s+(?:class|classes|tuition|tutor|tutoring)\b/i', $text);
        $hasOffline = (bool)preg_match('/\b(?:home\s+tuition|offline|classroom|at\s+home)\b/i', $text);

        if ($hasOnline && $hasOffline) return 'Both';
        if ($hasOnline) return 'Online';
        if ($hasOffline) return 'Offline';
        return null;
    }

    private function extractFees(string $text): ?string
    {
        if (preg_match('/(?:₹|Rs\.?|INR)\s*([0-9,]{2,7})(?:\s*(?:\/|\s*per\s*)\s*(?:hr|hour|month|class))?/i', $text, $m)) {
            return trim($m[0]);
        }
        return null;
    }

    private function extractClasses(string $text): ?string
    {
        if (preg_match('/\b(?:Class(?:es)?|Grade)\s*\d{1,2}\s*(?:to|\-|–)\s*(?:Class\s*)?\d{1,2}\b/i', $text, $m)) {
            return trim($m[0]);
        }
        return null;
    }
}
