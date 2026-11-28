<?php

namespace App\Services\TeacherDiscovery\Providers;

use App\Models\TeacherDiscoverySetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use RuntimeException;

class SearchProviderManager
{
    /** @var array<string, SearchProviderInterface> */
    private array $providers;

    public function __construct()
    {
        $this->providers = [
            'serper'     => new SerperSearchProvider(),
            'google_cse' => new GoogleCustomSearchProvider(),
            'bing'       => new BingSearchProvider(),
        ];
    }

    public function provider(?string $name = null): SearchProviderInterface
    {
        $key = $name ?: TeacherDiscoverySetting::current()->search_provider ?: 'google_cse';
        if (!isset($this->providers[$key])) {
            throw new RuntimeException("Unsupported search provider: {$key}");
        }
        return $this->providers[$key];
    }

    /**
     * Execute paginated searches across queries with shared server-side rate limiting.
     */
    public function executeQueries(array $queries, int $maxRecords, TeacherDiscoverySetting $settings): array
    {
        $provider = $this->provider($settings->search_provider);
        $rateLimit = max(1, (int)$settings->rate_limit_per_minute);
        $perRequestLimit = $provider->maxPerRequest();

        $collected = [];
        $seenUrls = [];

        foreach ($queries as $query) {
            if (count($collected) >= $maxRecords) {
                break;
            }

            $offset = 0;
            $maxPagesPerQuery = (int)ceil($maxRecords / max(1, $perRequestLimit));

            for ($page = 0; $page < $maxPagesPerQuery; $page++) {
                $remaining = $maxRecords - count($collected);
                if ($remaining <= 0) {
                    break;
                }

                // Shared rate limiter across web requests and queue workers
                $rateKey = 'teacher_discovery_api:' . $provider->getProviderName();
                if (RateLimiter::tooManyAttempts($rateKey, $rateLimit)) {
                    $wait = RateLimiter::availableIn($rateKey);
                    Log::warning("TeacherDiscovery rate limit reached for {$provider->getProviderName()} ({$rateLimit}/min).");
                    throw new RuntimeException("Search API rate limit reached ({$rateLimit} req/min). Please retry after {$wait} seconds.");
                }
                RateLimiter::hit($rateKey, 60);

                $batch = $provider->search($query, min($perRequestLimit, $remaining), $settings, $offset);
                if (empty($batch)) {
                    break; // No more pages for this query
                }

                $newInBatch = 0;
                foreach ($batch as $item) {
                    $canon = strtolower(rtrim($item['url'] ?? '', '/'));
                    if ($canon === '' || isset($seenUrls[$canon])) {
                        continue;
                    }
                    $seenUrls[$canon] = true;
                    $collected[] = $item;
                    $newInBatch++;
                    if (count($collected) >= $maxRecords) {
                        break 2;
                    }
                }

                if (count($batch) < $perRequestLimit || $newInBatch === 0) {
                    break;
                }
                $offset += count($batch);
            }
        }

        return $collected;
    }

    /**
     * Run a live credential test and cache status ('configured' | 'not_set' | 'invalid').
     */
    public function testProvider(string $providerName, TeacherDiscoverySetting $settings): array
    {
        $provider = $this->provider($providerName);
        $result = $provider->validateCredentials($settings);

        Cache::put("teacher_discovery_provider_status:{$providerName}", [
            'status'           => $result['status'],
            'message'          => $result['message'],
            'response_time_ms' => $result['response_time_ms'],
            'tested_at'        => now()->toDateTimeString(),
        ], 86400);

        return $result;
    }

    /**
     * Return safe status map for all providers (NEVER returns actual API keys).
     */
    public function getProvidersStatus(): array
    {
        $statuses = [];

        foreach ($this->providers as $key => $provider) {
            $configured = $provider->isConfigured();
            $cached = Cache::get("teacher_discovery_provider_status:{$key}");

            if (!$configured) {
                $status = 'not_set';
            } elseif (is_array($cached) && ($cached['status'] ?? null) === 'invalid') {
                $status = 'invalid';
            } else {
                $status = 'configured';
            }

            $statuses[$key] = [
                'status'           => $status,
                'configured'       => $configured,
                'last_message'     => is_array($cached) ? ($cached['message'] ?? null) : null,
                'response_time_ms' => is_array($cached) ? ($cached['response_time_ms'] ?? null) : null,
                'tested_at'        => is_array($cached) ? ($cached['tested_at'] ?? null) : null,
            ];
        }

        return $statuses;
    }
}
