<?php

namespace App\Http\Controllers;

use App\Exports\TeacherDiscoveryResultsExport;
use App\Jobs\ProcessTeacherDiscoveryJob;
use App\Models\CustomData;
use App\Models\TeacherDiscoveryResult;
use App\Models\TeacherDiscoverySearch;
use App\Models\TeacherDiscoverySetting;
use App\Models\User;
use App\Services\TeacherDiscovery\Providers\SearchProviderManager;
use App\Services\TeacherDiscovery\SearchProviderService;
use App\Services\TeacherDiscovery\TeacherDiscoveryImportService;
use App\Services\TeacherDiscovery\TeacherDiscoveryService;
use App\Services\TeacherDiscovery\TeacherDuplicateDetectionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TeacherDiscoveryController extends Controller
{
    public function __construct(
        private TeacherDiscoveryService $discoveryService,
        private TeacherDiscoveryImportService $importService,
        private TeacherDuplicateDetectionService $duplicateService
    ) {}

    /**
     * Search Teachers page + Dashboard KPIs + Latest Search Results Preview
     */
    public function index(Request $request)
    {
        $settings = TeacherDiscoverySetting::current();
        $latestSearch = TeacherDiscoverySearch::latest('id')->first();

        $results = null;
        if ($latestSearch) {
            $results = TeacherDiscoveryResult::where('search_id', $latestSearch->id)
                ->orderBy('id')
                ->paginate(25)
                ->withQueryString();
        }

        $subjects = CustomData::where('key_name', 'subject')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/TeacherDiscovery/Search', [
            'stats'             => $this->getDashboardStats(),
            'settings'          => $settings,
            'providersStatus'   => SearchProviderService::configuredProvidersStatus(),
            'activeSearch'      => $latestSearch,
            'results'           => $results,
            'subjects'          => $subjects,
        ]);
    }

    /**
     * Launch a new public teacher discovery search (sync for small batches, queued for large searches)
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'country'           => 'required|string|max:100',
            'state'             => 'required|string|max:120',
            'city'              => 'required|string|max:120',
            'locality'          => 'nullable|string|max:191',
            'subject'           => 'nullable|string|max:191',
            'teacher_type'      => 'nullable|string|max:100',
            'experience_filter' => 'nullable|string|max:60',
            'teaching_mode'     => 'nullable|in:Online,Offline,Both',
            'max_records'       => 'required|integer|in:10,25,50,100',
        ]);

        $settings = TeacherDiscoverySetting::current();

        $search = TeacherDiscoverySearch::create([
            'country'           => trim($validated['country']),
            'state'             => trim($validated['state']),
            'city'              => trim($validated['city']),
            'locality'          => isset($validated['locality']) ? trim($validated['locality']) : null,
            'subject'           => isset($validated['subject']) ? trim($validated['subject']) : null,
            'teacher_type'      => isset($validated['teacher_type']) ? trim($validated['teacher_type']) : null,
            'experience_filter' => isset($validated['experience_filter']) ? trim($validated['experience_filter']) : null,
            'teaching_mode'     => $validated['teaching_mode'] ?? 'Both',
            'max_records'       => (int)$validated['max_records'],
            'search_provider'   => $settings->search_provider,
            'status'            => 'queued',
            'progress_percent'  => 0,
            'created_by'        => Auth::id(),
        ]);

        // Use async Laravel Queue for large searches when queue driver is not sync
        $useAsync = ((int)$search->max_records > (int)$settings->use_queue_above)
            && config('queue.default') !== 'sync';

        if ($useAsync) {
            ProcessTeacherDiscoveryJob::dispatch($search->id);
            return redirect("/admin/teacher-discovery/searches/{$search->id}")
                ->with('success', 'Large discovery search queued! Progress will update automatically.');
        }

        $this->discoveryService->executeSearch($search);
        $search->refresh();

        if ($search->status === 'failed') {
            return redirect("/admin/teacher-discovery/searches/{$search->id}")
                ->with('error', $search->error_message ?: 'Teacher discovery search failed.');
        }

        return redirect("/admin/teacher-discovery/searches/{$search->id}")
            ->with('success', "Discovery completed! Found {$search->total_found} public record(s) ({$search->total_duplicates} potential duplicate(s)). Review and select records to import.");
    }

    /**
     * View a specific discovery search and preview its extracted results
     */
    public function showSearch(Request $request, $id)
    {
        $search = TeacherDiscoverySearch::findOrFail($id);
        $settings = TeacherDiscoverySetting::current();

        $query = TeacherDiscoveryResult::where('search_id', $search->id)->orderBy('id');

        if ($request->filled('import_status') && $request->import_status !== 'all') {
            $query->where('import_status', $request->import_status);
        }
        if ($request->filled('duplicate_status') && $request->duplicate_status !== 'all') {
            $query->where('duplicate_status', $request->duplicate_status);
        }

        $results = $query->paginate(25)->withQueryString();
        $subjects = CustomData::where('key_name', 'subject')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/TeacherDiscovery/Search', [
            'stats'           => $this->getDashboardStats(),
            'settings'        => $settings,
            'providersStatus' => SearchProviderService::configuredProvidersStatus(),
            'activeSearch'    => $search,
            'results'         => $results,
            'subjects'        => $subjects,
            'filters'         => [
                'import_status'    => $request->query('import_status', 'all'),
                'duplicate_status' => $request->query('duplicate_status', 'all'),
            ],
        ]);
    }

    /**
     * Live JSON progress endpoint for queued/processing searches
     */
    public function searchStatus($id)
    {
        $search = TeacherDiscoverySearch::findOrFail($id);

        return response()->json([
            'id'               => $search->id,
            'status'           => $search->status,
            'progress_percent' => $search->progress_percent,
            'total_found'      => $search->total_found,
            'total_imported'   => $search->total_imported,
            'total_duplicates' => $search->total_duplicates,
            'error_message'    => $search->error_message,
        ]);
    }

    /**
     * Discovery History page with filters & pagination
     */
    public function history(Request $request)
    {
        $query = TeacherDiscoverySearch::with('creator:id,name')->latest('id');

        if ($request->filled('state')) {
            $query->where('state', 'LIKE', '%' . trim($request->state) . '%');
        }
        if ($request->filled('city')) {
            $query->where('city', 'LIKE', '%' . trim($request->city) . '%');
        }
        if ($request->filled('subject')) {
            $query->where('subject', 'LIKE', '%' . trim($request->subject) . '%');
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $searches = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/TeacherDiscovery/History', [
            'stats'    => $this->getDashboardStats(),
            'searches' => $searches,
            'filters'  => $request->only(['state', 'city', 'subject', 'status', 'date']),
        ]);
    }

    /**
     * Imported Teachers page (with Pending Verification / Verified / Rejected controls)
     */
    public function imported(Request $request)
    {
        $query = TeacherDiscoveryResult::with(['search:id,city,state,subject', 'importedUser:id,name,email,is_active'])
            ->where('import_status', 'imported')
            ->latest('imported_at');

        if ($request->filled('state')) {
            $query->where('state', 'LIKE', '%' . trim($request->state) . '%');
        }
        if ($request->filled('city')) {
            $query->where('city', 'LIKE', '%' . trim($request->city) . '%');
        }
        if ($request->filled('subject')) {
            $query->where('subjects', 'LIKE', '%' . trim($request->subject) . '%');
        }
        if ($request->filled('verification_status') && $request->verification_status !== 'all') {
            $query->where('verification_status', $request->verification_status);
        }
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $imported = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/TeacherDiscovery/Imported', [
            'stats'    => $this->getDashboardStats(),
            'imported' => $imported,
            'filters'  => $request->only(['state', 'city', 'subject', 'verification_status', 'date']),
        ]);
    }

    /**
     * Import Settings page (API secrets stay in .env — never sent to frontend)
     */
    public function settings()
    {
        return Inertia::render('Admin/TeacherDiscovery/Settings', [
            'settings'        => TeacherDiscoverySetting::current(),
            'providersStatus' => SearchProviderService::configuredProvidersStatus(),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'search_provider'            => 'required|in:google_cse,bing,serper',
            'max_results_default'        => 'required|integer|in:10,25,50,100',
            'timeout_seconds'            => 'required|integer|min:5|max:60',
            'max_retries'                => 'required|integer|min:0|max:4',
            'rate_limit_per_minute'      => 'required|integer|min:1|max:120',
            'respect_robots_txt'         => 'boolean',
            'match_by_email'             => 'boolean',
            'match_by_phone'             => 'boolean',
            'match_by_name_city_subject' => 'boolean',
            'match_by_source_url'        => 'boolean',
            'import_mode'                => 'required|in:manual,auto',
            'default_account_status'     => 'required|in:pending_verification,inactive,active,verified',
            'use_queue_above'            => 'required|integer|min:10|max:100',
        ]);

        $settings = TeacherDiscoverySetting::current();
        $settings->update($validated);
        TeacherDiscoverySetting::clearCache();

        return redirect()->back()->with('success', 'Teacher Discovery import settings saved and applied to future searches.');
    }

    /**
     * Run a live Test Connection request against a Search API provider (never exposes API keys).
     */
    public function testProvider(Request $request, SearchProviderManager $manager)
    {
        $validated = $request->validate([
            'provider' => 'required|in:google_cse,bing,serper',
        ]);

        $settings = TeacherDiscoverySetting::current();
        $result = $manager->testProvider($validated['provider'], $settings);

        return response()->json([
            'success'          => $result['valid'],
            'status'           => $result['status'],
            'provider'         => $result['provider'],
            'response_time_ms' => $result['response_time_ms'],
            'sample_count'     => $result['sample_count'],
            'message'          => $result['message'],
            'providersStatus'  => $manager->getProvidersStatus(),
        ]);
    }

    /**
     * Edit a discovered record before importing (re-runs duplicate detection cleanly)
     */
    public function updateResult(Request $request, $id)
    {
        $result = TeacherDiscoveryResult::findOrFail($id);

        $validated = $request->validate([
            'teacher_name'      => 'required|string|max:255',
            'email'             => 'nullable|email|max:191',
            'phone'             => 'nullable|string|max:40',
            'whatsapp'          => 'nullable|string|max:40',
            'gender'            => 'nullable|string|max:30',
            'state'             => 'nullable|string|max:120',
            'city'              => 'nullable|string|max:120',
            'locality'          => 'nullable|string|max:191',
            'full_address'      => 'nullable|string|max:500',
            'qualification'     => 'nullable|string|max:255',
            'experience'        => 'nullable|string|max:80',
            'teaching_mode'     => 'nullable|string|max:60',
            'hourly_fees'       => 'nullable|string|max:100',
            'institute_name'    => 'nullable|string|max:255',
            'biography'         => 'nullable|string|max:5000',
            'subjects'          => 'nullable',
        ]);

        $subjects = $request->input('subjects');
        if (is_string($subjects)) {
            $subjects = array_values(array_filter(array_map('trim', explode(',', $subjects))));
        }

        $result->fill(array_merge($validated, [
            'subjects' => !empty($subjects) ? $subjects : null,
        ]));

        // Re-run duplicate detection with updated values
        $settings = TeacherDiscoverySetting::current();
        $dup = $this->duplicateService->detect($result->toArray(), $settings, $result->id);
        $result->fill($dup);
        $result->save();

        TeacherDiscoveryImportService::refreshSearchCounters($result->search_id);

        return redirect()->back()->with('success', 'Discovered record updated.');
    }

    /**
     * Import selected discovered records into existing teachers database
     */
    public function importSelected(Request $request)
    {
        $request->validate([
            'result_ids'   => 'required|array|min:1',
            'result_ids.*' => 'integer|exists:teacher_discovery_results,id',
        ]);

        $summary = $this->importService->importBatch($request->input('result_ids'), true);

        $msg = "Imported {$summary['imported']} teacher(s)";
        if ($summary['skipped'] > 0) $msg .= ", skipped {$summary['skipped']} duplicate/already-imported";
        if ($summary['failed'] > 0) $msg .= ", {$summary['failed']} failed";

        return redirect()->back()->with($summary['imported'] > 0 ? 'success' : 'error', $msg . '.');
    }

    /**
     * Import all non-duplicate pending results for a discovery search
     */
    public function importAllNonDuplicates($searchId)
    {
        $ids = TeacherDiscoveryResult::where('search_id', $searchId)
            ->where('import_status', 'pending')
            ->where('duplicate_status', 'unique')
            ->pluck('id')
            ->toArray();

        if (empty($ids)) {
            return redirect()->back()->with('error', 'No unique pending records available to import.');
        }

        $summary = $this->importService->importBatch($ids, true);

        return redirect()->back()->with(
            'success',
            "Batch import finished: {$summary['imported']} imported, {$summary['skipped']} skipped."
        );
    }

    /**
     * Reject a discovered record before importing
     */
    public function rejectResult($id)
    {
        $result = TeacherDiscoveryResult::findOrFail($id);
        $result->import_status = 'rejected';
        $result->verification_status = 'rejected';
        $result->save();

        TeacherDiscoveryImportService::refreshSearchCounters($result->search_id);

        return redirect()->back()->with('success', 'Record marked as rejected.');
    }

    /**
     * Update verification status of an imported teacher (Pending Verification / Verified / Rejected)
     */
    public function verifyImported(Request $request, $id)
    {
        $request->validate([
            'verification_status' => 'required|in:pending_verification,verified,rejected',
        ]);

        $result = TeacherDiscoveryResult::findOrFail($id);
        $result->verification_status = $request->verification_status;
        $result->save();

        if ($result->imported_user_id) {
            $user = User::find($result->imported_user_id);
            if ($user) {
                $user->is_active = ($request->verification_status === 'verified') ? 1 : 0;
                $user->save();
            }
        }

        return redirect()->back()->with('success', 'Teacher verification status updated.');
    }

    /**
     * Export discovery results as CSV or Excel (.xlsx)
     */
    public function export(Request $request)
    {
        $format = strtolower($request->query('format', 'csv')) === 'xlsx' ? 'xlsx' : 'csv';

        $query = TeacherDiscoveryResult::latest('id');
        if ($request->filled('search_id')) {
            $query->where('search_id', (int)$request->search_id);
        }
        if ($request->filled('state')) {
            $query->where('state', 'LIKE', '%' . trim($request->state) . '%');
        }
        if ($request->filled('city')) {
            $query->where('city', 'LIKE', '%' . trim($request->city) . '%');
        }
        if ($request->filled('subject')) {
            $query->where('subjects', 'LIKE', '%' . trim($request->subject) . '%');
        }
        if ($request->filled('import_status') && $request->import_status !== 'all') {
            $query->where('import_status', $request->import_status);
        }
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $filename = 'teacher-discovery-' . date('Y-m-d-His') . '.' . $format;
        $writerType = $format === 'xlsx' ? \Maatwebsite\Excel\Excel::XLSX : \Maatwebsite\Excel\Excel::CSV;

        return Excel::download(new TeacherDiscoveryResultsExport($query->get()), $filename, $writerType);
    }

    private function getDashboardStats(): array
    {
        return [
            'total_searches'       => TeacherDiscoverySearch::count(),
            'total_discovered'     => TeacherDiscoveryResult::count(),
            'total_imported'       => TeacherDiscoveryResult::where('import_status', 'imported')->count(),
            'total_duplicates'     => TeacherDiscoveryResult::whereIn('duplicate_status', ['duplicate', 'possible_duplicate'])->count(),
            'pending_verification' => TeacherDiscoveryResult::where('verification_status', 'pending_verification')->count(),
            'rejected_records'     => TeacherDiscoveryResult::where('verification_status', 'rejected')->count(),
        ];
    }
}
