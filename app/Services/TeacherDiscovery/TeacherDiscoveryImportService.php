<?php

namespace App\Services\TeacherDiscovery;

use App\Helpers\HtmlSanitizer;
use App\Models\CustomData;
use App\Models\Teacher;
use App\Models\TeacherDiscoveryResult;
use App\Models\TeacherDiscoverySearch;
use App\Models\TeacherDiscoverySetting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TeacherDiscoveryImportService
{
    public function __construct(
        private TeacherDuplicateDetectionService $duplicateService
    ) {}

    /**
     * Import a batch of discovery result IDs into the existing users + teachers tables.
     * Never overwrites existing verified accounts, never sends emails/SMS, uses DB transactions.
     *
     * @param bool $isAutoImport When true, strictly never auto-activates accounts.
     */
    public function importBatch(array $resultIds, bool $skipDuplicates = true, bool $isAutoImport = false): array
    {
        $settings = TeacherDiscoverySetting::current();
        $results = TeacherDiscoveryResult::whereIn('id', $resultIds)->get();

        $imported = 0;
        $skipped = 0;
        $failed = 0;
        $errors = [];
        $touchedSearchIds = [];

        foreach ($results as $result) {
            $touchedSearchIds[] = $result->search_id;

            if ($result->import_status === 'imported') {
                $skipped++;
                continue;
            }

            if (empty(trim((string)$result->teacher_name))) {
                $skipped++;
                continue;
            }

            // Re-run duplicate detection right before import to prevent race duplicates
            $dup = $this->duplicateService->detect($result->toArray(), $settings, $result->id);
            $result->fill($dup);

            if ($skipDuplicates && $dup['duplicate_status'] === 'duplicate') {
                $result->import_status = 'skipped_duplicate';
                $result->save();
                $skipped++;
                continue;
            }

            // Auto-import must also skip possible duplicates
            if ($isAutoImport && $dup['duplicate_status'] !== 'unique') {
                $skipped++;
                continue;
            }

            try {
                DB::transaction(function () use ($result, $settings, $isAutoImport) {
                    $defaultStatus = $settings->default_account_status ?: 'pending_verification';
                    // Automatic import must NEVER automatically publish/activate accounts
                    $isActive = (!$isAutoImport && in_array($defaultStatus, ['active', 'verified'], true)) ? 1 : 0;
                    $verificationState = ($isActive === 1) ? 'verified' : 'pending_verification';

                    // Reuse existing users table (never send emails/SMS; inactive by default until verified)
                    $email = $result->normalized_email ?: null;
                    $phone = $result->normalized_phone ?: null;
                    $username = $email ?: ('discovered_' . Str::slug($result->teacher_name ?: 'tutor') . '_' . Str::random(6));

                    $user = new User();
                    $user->name = trim($result->teacher_name);
                    $user->email = $email ?: ($username . '@unclaimed.local');
                    $user->mobile = $phone;
                    $user->username = $username;
                    $user->password = Hash::make(Str::random(32));
                    $user->type = 'teacher';
                    $user->is_active = $isActive;
                    $user->save();

                    // Map discovered subjects to existing custom_data subject IDs or names
                    $subjectValue = $this->mapSubjects($result->subjects);
                    $modeValue = $this->mapTeachingMode($result->teaching_mode);

                    $teacher = new Teacher();
                    $teacher->user_id = $user->id;
                    $teacher->gender = $result->gender ?: null;
                    $teacher->description = $result->biography ? HtmlSanitizer::clean($result->biography) : null;
                    $teacher->whatsapp = $result->whatsapp ?: null;
                    $teacher->experience = $result->experience ?: null;
                    $teacher->qualification = $result->qualification ?: null;
                    $teacher->teaching_mode = $modeValue;
                    $teacher->subjects = $subjectValue;
                    $teacher->address = $result->full_address ?: ($result->locality ?: null);
                    $teacher->city = $result->city ?: null;
                    $teacher->state = $result->state ?: null;
                    $teacher->discovery_source_url = $result->source_url;
                    $teacher->discovery_source_name = $result->source_name;
                    $teacher->discovered_at = $result->created_at ?? now();
                    $teacher->save();

                    $result->import_status = 'imported';
                    $result->verification_status = $verificationState;
                    $result->imported_user_id = $user->id;
                    $result->imported_teacher_id = $teacher->id;
                    $result->imported_at = now();
                    $result->save();
                });

                $imported++;
            } catch (\Throwable $e) {
                $failed++;
                $errors[] = "Result #{$result->id} ({$result->teacher_name}): " . $e->getMessage();
            }
        }

        // Refresh counters on affected searches
        foreach (array_unique($touchedSearchIds) as $searchId) {
            self::refreshSearchCounters($searchId);
        }

        return [
            'imported' => $imported,
            'skipped'  => $skipped,
            'failed'   => $failed,
            'errors'   => $errors,
        ];
    }

    private function mapSubjects($subjects): ?string
    {
        if (empty($subjects) || !is_array($subjects)) {
            return null;
        }

        $knownSubjects = CustomData::where('key_name', 'subject')->get(['id', 'name']);
        $mapped = [];

        foreach ($subjects as $sub) {
            $subStr = trim((string)$sub);
            if ($subStr === '') continue;

            $match = $knownSubjects->first(fn ($item) => strcasecmp($item->name, $subStr) === 0);
            $mapped[] = $match ? (string)$match->id : $subStr;
        }

        return !empty($mapped) ? implode(',', array_unique($mapped)) : null;
    }

    private function mapTeachingMode(?string $mode): ?string
    {
        if (!$mode) return null;
        $knownModes = CustomData::where('key_name', 'teachmode')->get(['id', 'name']);
        $match = $knownModes->first(fn ($m) => stripos($m->name, $mode) !== false);
        return $match ? (string)$match->id : $mode;
    }

    public static function refreshSearchCounters(int $searchId): void
    {
        $search = TeacherDiscoverySearch::find($searchId);
        if (!$search) return;

        $search->total_found = TeacherDiscoveryResult::where('search_id', $searchId)->count();
        $search->total_imported = TeacherDiscoveryResult::where('search_id', $searchId)->where('import_status', 'imported')->count();
        $search->total_duplicates = TeacherDiscoveryResult::where('search_id', $searchId)->whereIn('duplicate_status', ['duplicate', 'possible_duplicate'])->count();
        $search->total_rejected = TeacherDiscoveryResult::where('search_id', $searchId)->where('import_status', 'rejected')->count();
        $search->save();
    }
}
