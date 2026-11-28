<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class TeacherDiscoverySetting extends Model
{
    public const CACHE_KEY = 'teacher_discovery_settings_singleton';

    protected $fillable = [
        'search_provider',
        'max_results_default',
        'timeout_seconds',
        'max_retries',
        'rate_limit_per_minute',
        'respect_robots_txt',
        'match_by_email',
        'match_by_phone',
        'match_by_name_city_subject',
        'match_by_source_url',
        'import_mode',
        'default_account_status',
        'use_queue_above',
    ];

    protected $casts = [
        'respect_robots_txt'         => 'boolean',
        'match_by_email'             => 'boolean',
        'match_by_phone'             => 'boolean',
        'match_by_name_city_subject' => 'boolean',
        'match_by_source_url'        => 'boolean',
    ];

    public static function current(): self
    {
        return Cache::remember(self::CACHE_KEY, 3600, function () {
            return self::firstOrCreate([], [
                'search_provider'            => env('DISCOVERY_SEARCH_PROVIDER', 'google_cse'),
                'max_results_default'        => 25,
                'timeout_seconds'            => 15,
                'max_retries'                => 3,
                'rate_limit_per_minute'      => 20,
                'respect_robots_txt'         => true,
                'match_by_email'             => true,
                'match_by_phone'             => true,
                'match_by_name_city_subject' => true,
                'match_by_source_url'        => true,
                'import_mode'                => 'manual',
                'default_account_status'     => 'pending_verification',
                'use_queue_above'            => 25,
            ]);
        });
    }

    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
