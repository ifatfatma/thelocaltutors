<?php

namespace App\Services\TeacherDiscovery;

use App\Models\TeacherDiscoverySearch;
use App\Models\TeacherDiscoverySetting;
use App\Services\TeacherDiscovery\Providers\SearchProviderManager;

class SearchProviderService
{
    public function __construct(
        private SearchProviderManager $manager
    ) {}

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
            $queries[] = trim("{$subject} home tutors in {$shortLoc} {$search->state} {$search->country}");
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
     * Execute paginated search queries via the active provider in SearchProviderManager.
     */
    public function search(array $queries, int $maxRecords, TeacherDiscoverySetting $settings): array
    {
        return $this->manager->executeQueries($queries, $maxRecords, $settings);
    }

    /**
     * Return safe credential availability & last test status per provider (never exposes API keys).
     */
    public static function configuredProvidersStatus(): array
    {
        return (new SearchProviderManager())->getProvidersStatus();
    }
}
