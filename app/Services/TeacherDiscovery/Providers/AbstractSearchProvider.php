<?php

namespace App\Services\TeacherDiscovery\Providers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;

abstract class AbstractSearchProvider implements SearchProviderInterface
{
    /**
     * Check that a credential string is non-empty and not an obvious placeholder.
     */
    protected function isRealCredential(?string $value): bool
    {
        $val = trim((string)$value);
        if ($val === '' || strlen($val) < 6) {
            return false;
        }
        $lower = strtolower($val);
        foreach (['null', 'your_', 'replace_', 'placeholder', 'changeme', 'xxxx', 'test_key'] as $bad) {
            if (str_contains($lower, $bad)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Decide whether a failed HTTP call should be retried (only transient network/429/5xx, NEVER 400/401/403).
     */
    protected function shouldRetry(\Throwable $exception): bool
    {
        if ($exception instanceof ConnectionException) {
            return true;
        }
        if ($exception instanceof RequestException && $exception->response) {
            $status = $exception->response->status();
            return $status === 429 || $status >= 500;
        }
        return false;
    }

    /**
     * Exponential backoff delay in milliseconds (attempt 1 -> 500ms, 2 -> 1000ms, 3 -> 2000ms).
     */
    protected function backoffMs(int $attempt): int
    {
        return (int)(500 * (2 ** max(0, $attempt - 1)));
    }
}
