<?php

namespace App\Services\TeacherDiscovery\Providers;

use App\Models\TeacherDiscoverySetting;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class BingSearchProvider extends AbstractSearchProvider
{
    public function getProviderName(): string
    {
        return 'bing';
    }

    public function maxPerRequest(): int
    {
        return 50; // Bing Web Search v7 limit per request
    }

    public function isConfigured(): bool
    {
        return $this->isRealCredential(config('services.teacher_discovery.bing_api_key'));
    }

    public function search(string $query, int $count, TeacherDiscoverySetting $settings, int $offset = 0): array
    {
        if (!$this->isConfigured()) {
            throw new RuntimeException('Bing Web Search v7 is not configured. Please set BING_SEARCH_API_KEY in your server .env file.');
        }

        $apiKey = trim((string)config('services.teacher_discovery.bing_api_key'));
        $endpoint = trim((string)config('services.teacher_discovery.bing_endpoint', 'https://api.bing.microsoft.com/v7.0/search'));
        $timeout = max(5, (int)$settings->timeout_seconds);
        $retries = max(0, min(4, (int)$settings->max_retries));

        $response = Http::connectTimeout(min(8, $timeout))
            ->timeout($timeout)
            ->retry($retries, fn ($attempt) => $this->backoffMs($attempt), fn ($e) => $this->shouldRetry($e), false)
            ->withHeaders(['Ocp-Apim-Subscription-Key' => $apiKey])
            ->get($endpoint, [
                'q'      => $query,
                'count'  => min($this->maxPerRequest(), max(1, $count)),
                'offset' => max(0, $offset),
                'mkt'    => 'en-IN',
            ]);

        if (!$response->successful()) {
            $status = $response->status();
            $errMsg = $response->json('error.message') ?? $response->json('message') ?? 'Request failed';
            if (in_array($status, [401, 403], true)) {
                throw new RuntimeException("Bing Search authentication failed (HTTP {$status}): Invalid BING_SEARCH_API_KEY.");
            }
            if ($status === 429) {
                throw new RuntimeException("Bing Search quota/rate limit exceeded (HTTP 429): {$errMsg}");
            }
            throw new RuntimeException("Bing Search API error (HTTP {$status}): {$errMsg}");
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
                'message'          => 'BING_SEARCH_API_KEY is not set in .env.',
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
                'message'          => "Bing Web Search v7 connected successfully ({$ms} ms, " . count($results) . " sample results).",
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
        $items = $rawResponse['webPages']['value'] ?? [];
        $results = [];

        foreach ($items as $item) {
            $link = trim((string)($item['url'] ?? ''));
            if ($link === '') continue;
            $displayUrl = $item['displayUrl'] ?? (parse_url($link, PHP_URL_HOST) ?: 'Web');
            $host = parse_url($link, PHP_URL_HOST) ?: 'Web';

            $results[] = [
                'title'       => trim((string)($item['name'] ?? '')),
                'url'         => $link,
                'snippet'     => trim((string)($item['snippet'] ?? '')),
                'image'       => null,
                'source_name' => preg_replace('/^www\./i', '', $host),
                'display_url' => $displayUrl,
                'raw'         => $item,
            ];
        }

        return $results;
    }
}
