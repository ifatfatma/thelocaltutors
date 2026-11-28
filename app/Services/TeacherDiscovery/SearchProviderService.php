<?php

namespace App\Services\TeacherDiscovery;

use App\Models\TeacherDiscoverySearch;
use App\Models\TeacherDiscoverySetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use RuntimeException;

class SearchProviderService
{
    /**
     * Build targeted public search queries from discovery filters.
     */
    public function buildQueries(TeacherDiscoverySearch $search): array
    {
        $locationParts = array_filter([$search->locality, $search->city, $search->state, $search->country]);
        $locationStr = implode(' ', $locationParts);
        $shortLoc = implode(' ', array_filter([$search->locality, $search->city])) ?: ($search->state ?: $search->country);
        $subject = trim((string)($search->subject ?? ''));
        $teacherType = trim((string)($search->teacher_type ?? ''));
        $mode = trim((string)($search->teaching_mode ?? ''));

        $queries = [];

        if ($subject !== '') {
            $queries[] = trim("{$subject} tutor {$shortLoc} {$search->state}");
            $queries[] = trim("{$subject} teacher {$shortLoc} profile");
        }

        if ($teacherType !== '') {
            $queries[] = trim("{$teacherType} {$subject} {$shortLoc}");
        } else {
            $queries[] = trim("home tutor {$subject} {$shortLoc}");
            $queries[] = trim("coaching teacher {$subject} {$search->city}");
        }

        if (strtolower($mode) === 'online') {
            $queries[] = trim("online {$subject} tutor {$search->state} {$search->country}");
        } elseif ($locationStr !== '') {
            $queries[] = trim("private tutor {$locationStr}");
        }

        return array_values(array_unique(array_filter($queries)));
    }

    /**
     * Execute search queries against the configured public search API provider.
     * Never fabricates records; throws descriptive errors if credentials are missing or API fails.
     *
     * @return array<int, array{title: string, url: string, snippet: string, image: ?string, source_name: string, raw: array}>
     */
    public function search(array $queries, int $maxRecords, TeacherDiscoverySetting $settings): array
    {
        $provider = $settings->search_provider ?: config('services.teacher_discovery.provider', 'google_cse');
        $timeout = max(5, (int)$settings->timeout_seconds);
        $retries = max(0, min(4, (int)$settings->max_retries));
        $rateLimit = max(1, (int)$settings->rate_limit_per_minute);

        $collected = [];
        $seenUrls = [];

        foreach ($queries as $query) {
            if (count($collected) >= $maxRecords) {
                break;
            }

            // Enforce API rate limiting per minute
            $rateKey = "teacher_discovery_api:{$provider}";
            if (RateLimiter::tooManyAttempts($rateKey, $rateLimit)) {
                $seconds = RateLimiter::availableIn($rateKey);
                Log::warning("TeacherDiscovery rate limit hit for {$provider}. Waiting {$seconds}s.");
                throw new RuntimeException("Search API rate limit reached ({$rateLimit}/min). Please retry after {$seconds} seconds.");
            }
            RateLimiter::hit($rateKey, 60);

            $needed = min(10, $maxRecords - count($collected));

            $items = match ($provider) {
                'google_cse' => $this->queryGoogleCse($query, $needed, $timeout, $retries),
                'bing'       => $this->queryBing($query, $needed, $timeout, $retries),
                'serper'     => $this->querySerper($query, $needed, $timeout, $retries),
                default      => throw new RuntimeException("Unsupported search provider: {$provider}"),
            };

            foreach ($items as $item) {
                $urlKey = strtolower(rtrim($item['url'] ?? '', '/'));
                if ($urlKey === '' || isset($seenUrls[$urlKey])) {
                    continue;
                }
                $seenUrls[$urlKey] = true;
                $collected[] = $item;
                if (count($collected) >= $maxRecords) {
                    break;
                }
            }
        }

        return $collected;
    }

    private function queryGoogleCse(string $query, int $count, int $timeout, int $retries): array
    {
        $apiKey = trim((string)config('services.teacher_discovery.google_cse_api_key'));
        $cx = trim((string)config('services.teacher_discovery.google_cse_cx'));

        if ($apiKey === '' || $cx === '') {
            throw new RuntimeException(
                'Google Custom Search API is not configured. Please set GOOGLE_CSE_API_KEY and GOOGLE_CSE_CX in your .env file (or switch provider in Import Settings).'
            );
        }

        $response = Http::timeout($timeout)
            ->retry($retries, 500)
            ->get('https://www.googleapis.com/customsearch/v1', [
                'key' => $apiKey,
                'cx'  => $cx,
                'q'   => $query,
                'num' => min(10, max(1, $count)),
                'gl'  => 'in',
            ]);

        if (!$response->successful()) {
            $errMsg = $response->json('error.message') ?? $response->body();
            throw new RuntimeException("Google Custom Search API error (HTTP {$response->status()}): {$errMsg}");
        }

        $items = $response->json('items', []);
        $results = [];

        foreach ($items as $item) {
            $link = $item['link'] ?? '';
            if (!$link) continue;
            $host = parse_url($link, PHP_URL_HOST) ?: 'Web';
            $pagemapImg = $item['pagemap']['cse_thumbnail'][0]['src']
                ?? $item['pagemap']['cse_image'][0]['src']
                ?? null;

            $results[] = [
                'title'       => $item['title'] ?? '',
                'url'         => $link,
                'snippet'     => $item['snippet'] ?? '',
                'image'       => $pagemapImg,
                'source_name' => preg_replace('/^www\./i', '', $host),
                'raw'         => $item,
            ];
        }

        return $results;
    }

    private function queryBing(string $query, int $count, int $timeout, int $retries): array
    {
        $apiKey = trim((string)config('services.teacher_discovery.bing_api_key'));
        $endpoint = trim((string)config('services.teacher_discovery.bing_endpoint', 'https://api.bing.microsoft.com/v7.0/search'));

        if ($apiKey === '') {
            throw new RuntimeException(
                'Bing Web Search API is not configured. Please set BING_SEARCH_API_KEY in your .env file (or switch provider in Import Settings).'
            );
        }

        $response = Http::timeout($timeout)
            ->retry($retries, 500)
            ->withHeaders(['Ocp-Apim-Subscription-Key' => $apiKey])
            ->get($endpoint, [
                'q'     => $query,
                'count' => min(50, max(1, $count)),
                'mkt'   => 'en-IN',
            ]);

        if (!$response->successful()) {
            $errMsg = $response->json('error.message') ?? $response->body();
            throw new RuntimeException("Bing Search API error (HTTP {$response->status()}): {$errMsg}");
        }

        $items = $response->json('webPages.value', []);
        $results = [];

        foreach ($items as $item) {
            $link = $item['url'] ?? '';
            if (!$link) continue;
            $host = parse_url($link, PHP_URL_HOST) ?: 'Web';

            $results[] = [
                'title'       => $item['name'] ?? '',
                'url'         => $link,
                'snippet'     => $item['snippet'] ?? '',
                'image'       => null,
                'source_name' => preg_replace('/^www\./i', '', $host),
                'raw'         => $item,
            ];
        }

        return $results;
    }

    private function querySerper(string $query, int $count, int $timeout, int $retries): array
    {
        $apiKey = trim((string)config('services.teacher_discovery.serper_api_key'));

        if ($apiKey === '') {
            throw new RuntimeException(
                'Serper Search API is not configured. Please set SERPER_API_KEY in your .env file (or switch provider in Import Settings).'
            );
        }

        $response = Http::timeout($timeout)
            ->retry($retries, 500)
            ->withHeaders([
                'X-API-KEY'    => $apiKey,
                'Content-Type' => 'application/json',
            ])
            ->post('https://google.serper.dev/search', [
                'q'   => $query,
                'gl'  => 'in',
                'num' => min(20, max(1, $count)),
            ]);

        if (!$response->successful()) {
            $errMsg = $response->json('message') ?? $response->body();
            throw new RuntimeException("Serper API error (HTTP {$response->status()}): {$errMsg}");
        }

        $items = $response->json('organic', []);
        $results = [];

        foreach ($items as $item) {
            $link = $item['link'] ?? '';
            if (!$link) continue;
            $host = parse_url($link, PHP_URL_HOST) ?: 'Web';

            $results[] = [
                'title'       => $item['title'] ?? '',
                'url'         => $link,
                'snippet'     => $item['snippet'] ?? '',
                'image'       => $item['imageUrl'] ?? null,
                'source_name' => preg_replace('/^www\./i', '', $host),
                'raw'         => $item,
            ];
        }

        return $results;
    }

    /**
     * Check which providers have credentials present in .env (returns booleans only, never keys!).
     */
    public static function configuredProvidersStatus(): array
    {
        return [
            'google_cse' => !empty(config('services.teacher_discovery.google_cse_api_key'))
                            && !empty(config('services.teacher_discovery.google_cse_cx')),
            'bing'       => !empty(config('services.teacher_discovery.bing_api_key')),
            'serper'     => !empty(config('services.teacher_discovery.serper_api_key')),
        ];
    }
}
