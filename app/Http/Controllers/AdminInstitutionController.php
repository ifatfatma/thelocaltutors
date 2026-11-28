<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use App\Models\InstitutionGallery;
use App\Models\User;
use App\Services\InstitutionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class AdminInstitutionController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'all');
        $status = $request->query('status', 'all');
        $search = trim((string)$request->query('search', ''));

        $query = Institution::with(['user:id,name,email'])
            ->withCount(['programs', 'galleries', 'inquiries'])
            ->latest('id');

        if ($type !== 'all' && array_key_exists($type, Institution::TYPES)) {
            $query->where('institution_type', $type);
        }

        if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $query->where('verification_status', $status);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('city', 'LIKE', "%{$search}%")
                  ->orWhere('state', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $institutions = $query->paginate(20)->withQueryString();

        $counts = [
            'all'                => Institution::count(),
            'coaching_institute' => Institution::where('institution_type', 'coaching_institute')->count(),
            'school'             => Institution::where('institution_type', 'school')->count(),
            'college'            => Institution::where('institution_type', 'college')->count(),
            'university'         => Institution::where('institution_type', 'university')->count(),
            'pending'            => Institution::where('verification_status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Institutions/Index', [
            'institutions' => $institutions,
            'counts'       => $counts,
            'filters'      => [
                'type'   => $type,
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $defaultType = $request->query('type', 'coaching_institute');
        if (!array_key_exists($defaultType, Institution::TYPES)) {
            $defaultType = 'coaching_institute';
        }

        $users = User::orderBy('name')->get(['id', 'name', 'email', 'type']);

        return Inertia::render('Admin/Institutions/Form', [
            'institution' => null,
            'defaultType' => $defaultType,
            'users'       => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'institution_type' => 'required|in:coaching_institute,school,college,university',
            'name'             => 'required|string|max:255',
            'email'            => 'nullable|email|max:191',
            'logo'             => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'cover_image'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'brochure_pdf'     => 'nullable|mimes:pdf|max:10240',
        ]);

        $institution = new Institution();
        $institution->verification_status = $request->input('verification_status', 'approved');
        $institution->is_active = $request->has('is_active')
            ? filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN)
            : true;

        InstitutionService::saveInstitution($institution, $request, true);

        return redirect('/admin/institutions?type=' . $institution->institution_type)
            ->with('success', $institution->type_label . ' created successfully.');
    }

    public function edit($id)
    {
        $institution = Institution::with(['programs', 'galleries', 'inquiries', 'user:id,name,email'])
            ->findOrFail($id);

        $users = User::orderBy('name')->get(['id', 'name', 'email', 'type']);

        return Inertia::render('Admin/Institutions/Form', [
            'institution' => $institution,
            'defaultType' => $institution->institution_type,
            'users'       => $users,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'institution_type' => 'required|in:coaching_institute,school,college,university',
            'name'             => 'required|string|max:255',
            'email'            => 'nullable|email|max:191',
            'logo'             => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'cover_image'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'brochure_pdf'     => 'nullable|mimes:pdf|max:10240',
        ]);

        $institution = Institution::findOrFail($id);
        InstitutionService::saveInstitution($institution, $request, true);

        return redirect('/admin/institutions?type=' . $institution->institution_type)
            ->with('success', $institution->type_label . ' updated successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $institution = Institution::findOrFail($id);

        if ($request->filled('verification_status')) {
            $vs = $request->input('verification_status');
            if (in_array($vs, ['pending', 'approved', 'rejected'], true)) {
                $institution->verification_status = $vs;
                if ($vs === 'approved') {
                    $institution->is_active = true;
                }
            }
        }

        if ($request->has('is_active')) {
            $institution->is_active = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->has('verified_badge')) {
            $institution->verified_badge = filter_var($request->input('verified_badge'), FILTER_VALIDATE_BOOLEAN);
        }

        $institution->save();

        return redirect()->back()->with('success', 'Institution status updated.');
    }

    public function deleteGallery($id)
    {
        $photo = InstitutionGallery::findOrFail($id);
        $fullPath = public_path(ltrim($photo->image_path, '/'));
        if (File::exists($fullPath)) {
            @File::delete($fullPath);
        }
        $photo->delete();

        return redirect()->back()->with('success', 'Gallery image deleted.');
    }

    public function destroy($id)
    {
        $institution = Institution::findOrFail($id);
        $institution->delete();

        return redirect()->back()->with('success', 'Institution removed successfully.');
    }
}
