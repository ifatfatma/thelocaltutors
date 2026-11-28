<?php

namespace App\Services\TeacherDiscovery;

use App\Models\TeacherDiscoveryResult;
use App\Models\TeacherDiscoverySetting;
use App\Models\User;

class TeacherDuplicateDetectionService
{
    public static function normalizeName(?string $name): ?string
    {
        if (!$name) return null;
        $clean = strtolower(trim($name));
        $clean = preg_replace('/^(dr|prof|mr|mrs|ms|miss|sir|madam)\.?\s+/i', '', $clean);
        $clean = preg_replace('/[^a-z0-9\s]/', '', $clean);
        return trim(preg_replace('/\s+/', ' ', $clean)) ?: null;
    }

    public static function normalizeEmail(?string $email): ?string
    {
        if (!$email) return null;
        $clean = strtolower(trim($email));
        return filter_var($clean, FILTER_VALIDATE_EMAIL) ? $clean : null;
    }

    public static function normalizePhone(?string $phone): ?string
    {
        if (!$phone) return null;
        $raw = trim($phone);
        $hasPlus = str_starts_with($raw, '+');
        $digits = preg_replace('/\D/', '', $raw);

        if ($digits === '' || strlen($digits) < 7) {
            return null;
        }

        // Normalize Indian numbers (+91 / 91 / leading 0) to 10 digits without corrupting non-Indian numbers
        if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
            return substr($digits, 2);
        }
        if (strlen($digits) === 11 && str_starts_with($digits, '0')) {
            return substr($digits, 1);
        }
        if (!$hasPlus && strlen($digits) === 10) {
            return $digits;
        }

        return ($hasPlus ? '+' : '') . $digits;
    }

    /**
     * Canonicalize a URL by normalizing scheme/host and removing common tracking parameters.
     */
    public static function canonicalizeUrl(?string $url): ?string
    {
        if (!$url) return null;
        $parsed = parse_url(trim($url));
        if (empty($parsed['host'])) {
            return null;
        }

        $scheme = strtolower($parsed['scheme'] ?? 'https');
        $host = preg_replace('/^www\./i', '', strtolower($parsed['host']));
        $path = rtrim($parsed['path'] ?? '', '/');

        $cleanQuery = '';
        if (!empty($parsed['query'])) {
            parse_str($parsed['query'], $params);
            $trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref', 'source'];
            foreach ($trackingKeys as $tk) {
                unset($params[$tk]);
            }
            if (!empty($params)) {
                ksort($params);
                $cleanQuery = '?' . http_build_query($params);
            }
        }

        return "{$scheme}://{$host}{$path}{$cleanQuery}";
    }

    /**
     * Detect duplicates against existing users/teachers and prior discovery results.
     *
     * @return array{
     *   normalized_name: ?string,
     *   normalized_email: ?string,
     *   normalized_phone: ?string,
     *   duplicate_status: string,
     *   duplicate_match_reason: ?string,
     *   matched_user_id: ?int
     * }
     */
    public function detect(array $data, TeacherDiscoverySetting $settings, ?int $excludeResultId = null): array
    {
        $normName = self::normalizeName($data['teacher_name'] ?? null);
        $normEmail = self::normalizeEmail($data['email'] ?? null);
        $normPhone = self::normalizePhone($data['phone'] ?? null);
        $canonicalUrl = self::canonicalizeUrl($data['source_url'] ?? null);
        $urlHash = $canonicalUrl ? hash('sha256', $canonicalUrl) : ($data['source_url_hash'] ?? null);

        $status = 'unique';
        $reason = null;
        $matchedUserId = null;

        // 1. Email match against existing users
        if ($settings->match_by_email && $normEmail) {
            $user = User::whereRaw('LOWER(email) = ?', [$normEmail])->first();
            if ($user) {
                $status = 'duplicate';
                $reason = "Exact email match with existing account (#{$user->id})";
                $matchedUserId = $user->id;
            }
        }

        // 2. Mobile match against existing users
        if ($status === 'unique' && $settings->match_by_phone && $normPhone) {
            $user = User::where('mobile', $normPhone)
                ->orWhere('mobile', 'LIKE', "%{$normPhone}")
                ->first();
            if ($user) {
                $status = 'duplicate';
                $reason = "Exact mobile number match with existing account (#{$user->id})";
                $matchedUserId = $user->id;
            }
        }

        // 3. Source URL match against existing discovery results or imported teachers
        if ($status === 'unique' && $settings->match_by_source_url && $urlHash) {
            $prevResult = TeacherDiscoveryResult::where('source_url_hash', $urlHash)
                ->when($excludeResultId, fn ($q) => $q->where('id', '!=', $excludeResultId))
                ->first();
            if ($prevResult) {
                $status = 'duplicate';
                $reason = "Source profile URL already discovered (Result #{$prevResult->id})";
                $matchedUserId = $prevResult->imported_user_id;
            }
        }

        // 4. Name + City + Subject match against existing teachers
        if ($status === 'unique' && $settings->match_by_name_city_subject && $normName && !empty($data['city'])) {
            $city = trim((string)$data['city']);
            $existingTeacher = User::where('type', 'teacher')
                ->whereRaw('LOWER(name) = ?', [$normName])
                ->whereHas('teachermore', function ($q) use ($city) {
                    $q->where('city', 'LIKE', "%{$city}%");
                })
                ->first();

            if ($existingTeacher) {
                $status = 'possible_duplicate';
                $reason = "Name & city match with existing teacher (#{$existingTeacher->id})";
                $matchedUserId = $existingTeacher->id;
            }
        }

        return [
            'normalized_name'        => $normName,
            'normalized_email'       => $normEmail,
            'normalized_phone'       => $normPhone,
            'duplicate_status'       => $status,
            'duplicate_match_reason' => $reason,
            'matched_user_id'        => $matchedUserId,
        ];
    }
}
