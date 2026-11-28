<?php

namespace App\Services\TeacherDiscovery\Providers;

use App\Models\TeacherDiscoverySetting;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class SerperSearchProvider extends AbstractSearchProvider
{
    public function getProviderName(): string
    {
        return 'serper';
    }

    public function maxPerRequest(): int
    {
        return 25;
    }

    public function isConfigured(): bool
    {
        return $this->isRealCredential(config('services.teacher_discovery.serper_api_key'));
    }

    public function search(string $query, int $count, TeacherDiscoverySetting $settings, int $offset = 0): array
    {
        if (!$this->isConfigured()) {
            throw new RuntimeException('Serper Google Search API is not configured. Please set SERPER_API_KEY in your server .env file.');
        }

        $apiKey = trim((string)config('services.teacher_discovery.serper_api_key'));
        $timeout = max(5, (int)$settings->timeout_seconds);
        $retries = max(0, min(4, (int)$settings->max_retries));
        $perPage = min($this->maxPerRequest(), max(1, $count));
        $page = $offset > 0 ? (int)floor($offset / $perPage) + 1 : 1;

        $response = Http::connectTimeout(min(8, $timeout))
            ->timeout($timeout)
            ->retry($retries, fn ($attempt) => $this->backoffMs($attempt), fn ($e) => $this->shouldRetry($e), false)
            ->withHeaders([
                'X-API-KEY'    => $apiKey,
                'Content-Type' => 'application/json',
            ])
            ->post('https://google.serper.dev/search', [
                'q'    => $query,
                'num'  => $perPage,
                'gl'   => 'in',
                'hl'   => 'en',
                'page' => $page,
            ]);

        if (!$response->successful()) {
            $status = $response->status();
            $errMsg = $response->json('message') ?? 'Request failed';
            if (in_array($status, [401, 403], true)) {
                throw new RuntimeException("Serper authentication failed (HTTP {$status}): Invalid or unauthorized SERPER_API_KEY.");
            }
            if ($status === 429) {
                throw new RuntimeException('Serper API rate/quota limit exceeded (HTTP 429). Please wait or check your Serper plan.');
            }
            throw new RuntimeException("Serper API error (HTTP {$status}): {$errMsg}");
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
                'message'          => 'SERPER_API_KEY is not set in .env.',
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
                'message'          => "Serper Google Search API connected successfully ({$ms} ms, " . count($results) . " sample results).",
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
        $items = $rawResponse['organic'] ?? [];
        $results = [];

        foreach ($items as $item) {
            $link = trim((string)($item['link'] ?? ''));
            if ($link === '') continue;
            $host = parse_url($link, PHP_URL_HOST) ?: 'Web';

            $results[] = [
                'title'       => trim((string)($item['title'] ?? '')),
                'url'         => $link,
                'snippet'     => trim((string)($item['snippet'] ?? '')),
                'image'       => $item['imageUrl'] ?? null,
                'source_name' => preg_replace('/^www\./i', '', $host),
                'display_url' => $host,
                'raw'         => $item,
            ];
        }

        return $results;
    }
}
