<?php

namespace App\Services\TeacherDiscovery\Providers;

use App\Models\TeacherDiscoverySetting;

interface SearchProviderInterface
{
    /**
     * Return internal provider identifier (e.g., serper, google_cse, bing).
     */
    public function getProviderName(): string;

    /**
     * Check whether required credentials exist in server config (ignoring placeholders).
     */
    public function isConfigured(): bool;

    /**
     * Execute a single paginated search request and return normalized results.
     *
     * @return array<int, array{title: string, url: string, snippet: string, image: ?string, source_name: string, display_url: ?string, raw: array}>
     */
    public function search(string $query, int $count, TeacherDiscoverySetting $settings, int $offset = 0): array;

    /**
     * Run a lightweight live request to validate server-side credentials.
     *
     * @return array{valid: bool, status: string, provider: string, response_time_ms: int, sample_count: int, message: string}
     */
    public function validateCredentials(TeacherDiscoverySetting $settings): array;

    /**
     * Normalize raw API payload into unified search hit structure.
     */
    public function normalizeResults(array $rawResponse): array;

    /**
     * Maximum results supported per single API call.
     */
    public function maxPerRequest(): int;
}
