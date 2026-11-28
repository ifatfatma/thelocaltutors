<?php

namespace App\Services\TeacherDiscovery\Providers;

use App\Models\TeacherDiscoverySetting;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GoogleCustomSearchProvider extends AbstractSearchProvider
{
    public function getProviderName(): string
    {
        return 'google_cse';
    }

    public function maxPerRequest(): int
    {
        return 10; // Google CSE hard limit per request
    }

    public function isConfigured(): bool
    {
        return $this->isRealCredential(config('services.teacher_discovery.google_cse_api_key'))
            && $this->isRealCredential(config('services.teacher_discovery.google_cse_cx'));
    }

    public function search(string $query, int $count, TeacherDiscoverySetting $settings, int $offset = 0): array
    {
        if (!$this->isConfigured()) {
            throw new RuntimeException('Google Custom Search API requires both GOOGLE_CSE_API_KEY and GOOGLE_CSE_CX in your server .env file.');
        }

        $apiKey = trim((string)config('services.teacher_discovery.google_cse_api_key'));
        $cx = trim((string)config('services.teacher_discovery.google_cse_cx'));
        $timeout = max(5, (int)$settings->timeout_seconds);
        $retries = max(0, min(4, (int)$settings->max_retries));
        $start = max(1, $offset + 1);

        // Google CSE rejects start > 91
        if ($start > 91) {
            return [];
        }

        $num = min($this->maxPerRequest(), max(1, $count), 101 - $start);

        $response = Http::connectTimeout(min(8, $timeout))
            ->timeout($timeout)
            ->retry($retries, fn ($attempt) => $this->backoffMs($attempt), fn ($e) => $this->shouldRetry($e), false)
            ->get('https://www.googleapis.com/customsearch/v1', [
                'key'   => $apiKey,
                'cx'    => $cx,
                'q'     => $query,
                'num'   => $num,
                'start' => $start,
                'gl'    => 'in',
            ]);

        if (!$response->successful()) {
            $status = $response->status();
            $errMsg = $response->json('error.message') ?? 'Request failed';
            if ($status === 429 || str_contains(strtolower($errMsg), 'quota')) {
                throw new RuntimeException("Google Custom Search quota exceeded (HTTP {$status}): {$errMsg}");
            }
            if (in_array($status, [400, 401, 403], true)) {
                throw new RuntimeException("Google Custom Search credential/configuration error (HTTP {$status}): {$errMsg}");
            }
            throw new RuntimeException("Google Custom Search API error (HTTP {$status}): {$errMsg}");
        }

        return $this->normalizeResults($response->json() ?? []);
    }

    public function validateCredentials(TeacherDiscoverySetting $settings): array
    {
        if (!$this->isConfigured()) {
            return [
                'valid'            => false,
                'status'           => 'not_set',
                'provider'         => $this->getProviderName(),
                'response_time_ms' => 0,
                'sample_count'     => 0,
                'message'          => 'Both GOOGLE_CSE_API_KEY and GOOGLE_CSE_CX must be set in .env.',
            ];
        }

        $start = microtime(true);
        try {
            $results = $this->search('Mathematics home tutor Kolkata India', 3, $settings, 0);
            $ms = (int)round((microtime(true) - $start) * 1000);
            return [
                'valid'            => true,
                'status'           => 'configured',
                'provider'         => $this->getProviderName(),
                'response_time_ms' => $ms,
                'sample_count'     => count($results),
                'message'          => "Google Custom Search API connected successfully ({$ms} ms, " . count($results) . " sample results).",
            ];
        } catch (\Throwable $e) {
            $ms = (int)round((microtime(true) - $start) * 1000);
            return [
                'valid'            => false,
                'status'           => 'invalid',
                'provider'         => $this->getProviderName(),
                'response_time_ms' => $ms,
                'sample_count'     => 0,
                'message'          => $e->getMessage(),
            ];
        }
    }

    public function normalizeResults(array $rawResponse): array
    {
        $items = $rawResponse['items'] ?? [];
        $results = [];

        foreach ($items as $item) {
            $link = trim((string)($item['link'] ?? ''));
            if ($link === '') continue;
            $displayLink = $item['displayLink'] ?? (parse_url($link, PHP_URL_HOST) ?: 'Web');
            $pagemapImg = $item['pagemap']['cse_thumbnail'][0]['src']
                ?? $item['pagemap']['cse_image'][0]['src']
                ?? null;

            $results[] = [
                'title'       => trim((string)($item['title'] ?? '')),
                'url'         => $link,
                'snippet'     => trim((string)($item['snippet'] ?? '')),
                'image'       => $pagemapImg,
                'source_name' => preg_replace('/^www\./i', '', $displayLink),
                'display_url' => $displayLink,
                'raw'         => $item,
            ];
        }

        return $results;
    }
}
