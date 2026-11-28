<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use App\Models\InstitutionGallery;
use App\Models\InstitutionInquiry;
use App\Services\InstitutionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class InstitutionDashboardController extends Controller
{
    /**
     * Institution Self-Management Dashboard
     */
    public function index()
    {
        $user = Auth::user();
        $institution = Institution::where('user_id', $user->id)
            ->with(['programs', 'galleries', 'inquiries'])
            ->first();

        // Auto-initialize institution shell if an institution-role user doesn't have one yet
        if (!$institution) {
            $validType = array_key_exists($user->type, Institution::TYPES)
                ? $user->type
                : 'coaching_institute';

            $institution = Institution::create([
                'user_id'             => $user->id,
                'institution_type'    => $validType,
                'name'                => $user->name ?: 'My Institution',
                'slug'                => \Illuminate\Support\Str::slug($user->name ?: 'institution') . '-' . $user->id,
                'email'               => $user->email,
                'phone'               => $user->mobile,
                'verification_status' => 'pending',
                'is_active'           => true,
            ]);
            $institution->load(['programs', 'galleries', 'inquiries']);
        }

        $stats = [
            'programs_count'  => $institution->programs->count(),
            'galleries_count' => $institution->galleries->count(),
            'inquiries_total' => $institution->inquiries->count(),
            'inquiries_new'   => $institution->inquiries->where('status', 'new')->count(),
        ];

        return Inertia::render('Dashboard/InstitutionDashboard', [
            'institution' => $institution,
            'stats'       => $stats,
        ]);
    }

    /**
     * Save institution profile, category details, programs, facilities, map coordinates, and brochure
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'nullable|email|max:191',
            'phone'        => 'nullable|string|max:40',
            'website'      => 'nullable|string|max:255',
            'logo'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'cover_image'  => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'brochure_pdf' => 'nullable|mimes:pdf|max:10240',
        ]);

        $user = Auth::user();
        $institution = Institution::where('user_id', $user->id)->firstOrFail();

        InstitutionService::saveInstitution($institution, $request, false);

        return redirect()->back()->with('success', 'Institution profile updated successfully!');
    }

    /**
     * Upload campus gallery photo(s)
     */
    public function uploadGallery(Request $request)
    {
        $request->validate([
            'gallery_images'   => 'required',
            'gallery_images.*' => 'image|mimes:jpg,jpeg,png,webp|max:4096',
            'caption'          => 'nullable|string|max:255',
            'category'         => 'nullable|string|max:80',
        ]);

        $institution = Institution::where('user_id', Auth::id())->firstOrFail();
        $files = $request->file('gallery_images');
        if (!is_array($files)) {
            $files = [$files];
        }

        foreach ($files as $file) {
            $path = InstitutionService::storeFile($file, 'institutions/gallery');
            InstitutionGallery::create([
                'institution_id' => $institution->id,
                'image_path'     => $path,
                'caption'        => trim((string)$request->input('caption', '')) ?: null,
                'category'       => trim((string)$request->input('category', 'Campus')) ?: 'Campus',
            ]);
        }

        return redirect()->back()->with('success', 'Campus gallery image(s) uploaded successfully.');
    }

    /**
     * Delete a campus gallery photo owned by this institution
     */
    public function deleteGallery($id)
    {
        $institution = Institution::where('user_id', Auth::id())->firstOrFail();
        $photo = InstitutionGallery::where('id', $id)
            ->where('institution_id', $institution->id)
            ->firstOrFail();

        $fullPath = public_path(ltrim($photo->image_path, '/'));
        if (File::exists($fullPath)) {
            @File::delete($fullPath);
        }
        $photo->delete();

        return redirect()->back()->with('success', 'Gallery image removed.');
    }

    /**
     * Update inquiry status (new -> contacted -> closed)
     */
    public function updateInquiryStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:new,contacted,closed',
        ]);

        $institution = Institution::where('user_id', Auth::id())->firstOrFail();
        $inquiry = InstitutionInquiry::where('id', $id)
            ->where('institution_id', $institution->id)
            ->firstOrFail();

        $inquiry->status = $request->status;
        $inquiry->save();

        return redirect()->back()->with('success', 'Inquiry status updated.');
    }
}
