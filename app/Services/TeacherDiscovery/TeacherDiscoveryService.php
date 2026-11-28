<?php

namespace App\Services\TeacherDiscovery;

use App\Models\TeacherDiscoveryResult;
use App\Models\TeacherDiscoverySearch;
use App\Models\TeacherDiscoverySetting;
use Illuminate\Support\Facades\Log;

class TeacherDiscoveryService
{
    public function __construct(
        private SearchProviderService $searchProvider,
        private TeacherDataExtractionService $extractor,
        private TeacherDuplicateDetectionService $duplicateDetector,
        private TeacherDiscoveryImportService $importer
    ) {}

    /**
     * Execute full discovery workflow for a TeacherDiscoverySearch record.
     */
    public function executeSearch(TeacherDiscoverySearch $search): TeacherDiscoverySearch
    {
        $settings = TeacherDiscoverySetting::current();

        $search->status = 'processing';
        $search->started_at = now();
        $search->progress_percent = 10;
        $search->error_message = null;
        $search->save();

        try {
            $queries = $this->searchProvider->buildQueries($search);
            $search->queries_executed = $queries;
            $search->progress_percent = 20;
            $search->save();

            // Step 1: Query permitted public search API
            $rawHits = $this->searchProvider->search($queries, (int)$search->max_records, $settings);
            $search->progress_percent = 45;
            $search->save();

            $totalHits = count($rawHits);
            $uniqueIdsForAutoImport = [];

            // Step 2: Extract public details & run duplicate detection
            foreach ($rawHits as $index => $hit) {
                $extracted = $this->extractor->extract($hit, $search, $settings);
                $dup = $this->duplicateDetector->detect($extracted, $settings);

                $result = TeacherDiscoveryResult::create(array_merge($extracted, $dup, [
                    'search_id'           => $search->id,
                    'import_status'       => 'pending',
                    'verification_status' => 'pending_verification',
                ]));

                if ($dup['duplicate_status'] === 'unique') {
                    $uniqueIdsForAutoImport[] = $result->id;
                }

                if ($totalHits > 0) {
                    $search->progress_percent = min(90, 45 + (int)round((($index + 1) / $totalHits) * 45));
                    $search->save();
                }
            }

            // Step 3: Auto-import ONLY if explicitly enabled in Import Settings (default is manual)
            if ($settings->import_mode === 'auto' && !empty($uniqueIdsForAutoImport)) {
                $this->importer->importBatch($uniqueIdsForAutoImport, true);
            }

            TeacherDiscoveryImportService::refreshSearchCounters($search->id);

            $search->refresh();
            $search->status = 'completed';
            $search->progress_percent = 100;
            $search->completed_at = now();
            $search->save();

            return $search;
        } catch (\Throwable $e) {
            Log::error("TeacherDiscovery Search #{$search->id} failed: " . $e->getMessage());

            $search->status = 'failed';
            $search->error_message = $e->getMessage();
            $search->completed_at = now();
            $search->save();

            return $search;
        }
    }
}
