<?php

namespace App\Services;

use App\Helpers\HtmlSanitizer;
use App\Models\Institution;
use App\Models\InstitutionGallery;
use App\Models\InstitutionProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class InstitutionService
{
    /**
     * Save (create or update) an institution along with media, details, facilities, and child programs.
     */
    public static function saveInstitution(Institution $institution, Request $request, bool $isAdmin = false): Institution
    {
        $name = trim((string)$request->input('name', $institution->name ?: 'Institution'));
        $type = $request->input('institution_type', $institution->institution_type ?: 'coaching_institute');
        if (!array_key_exists($type, Institution::TYPES)) {
            $type = 'coaching_institute';
        }

        $institution->institution_type = $type;
        $institution->name = $name;

        // Generate unique slug on creation or if empty
        if (empty($institution->slug)) {
            $baseSlug = Str::slug($name) ?: 'institution';
            $slug = $baseSlug;
            $counter = 1;
            while (Institution::withTrashed()->where('slug', $slug)->where('id', '!=', $institution->id ?? 0)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }
            $institution->slug = $slug;
        }

        $institution->tagline = trim((string)$request->input('tagline', '')) ?: null;
        $institution->established_year = $request->filled('established_year') ? (int)$request->input('established_year') : null;
        $institution->ownership_type = trim((string)$request->input('ownership_type', '')) ?: null;

        // Location & Map Coordinates
        $institution->address = trim((string)$request->input('address', '')) ?: null;
        $institution->area = trim((string)$request->input('area', '')) ?: null;
        $institution->city = trim((string)$request->input('city', '')) ?: null;
        $institution->district = trim((string)$request->input('district', '')) ?: null;
        $institution->state = trim((string)$request->input('state', '')) ?: null;
        $institution->pincode = trim((string)$request->input('pincode', '')) ?: null;

        $lat = $request->filled('latitude') ? (float)trim((string)$request->input('latitude')) : null;
        $lng = $request->filled('longitude') ? (float)trim((string)$request->input('longitude')) : null;
        if ($lat !== null && $lng !== null && $lat >= -90 && $lat <= 90 && $lng >= -180 && $lng <= 180) {
            $institution->latitude = number_format($lat, 7, '.', '');
            $institution->longitude = number_format($lng, 7, '.', '');
        } else {
            $institution->latitude = null;
            $institution->longitude = null;
        }

        // Contact
        $institution->phone = trim((string)$request->input('phone', '')) ?: null;
        $institution->whatsapp = trim((string)$request->input('whatsapp', '')) ?: null;
        $institution->email = trim((string)$request->input('email', '')) ?: null;
        $institution->website = trim((string)$request->input('website', '')) ?: null;

        // Admissions & Overview
        $admissionStatus = $request->input('admission_status', 'open');
        $institution->admission_status = in_array($admissionStatus, ['open', 'closed', 'upcoming'], true) ? $admissionStatus : 'open';
        $institution->admission_process = HtmlSanitizer::clean($request->input('admission_process'));
        $institution->fee_range = trim((string)$request->input('fee_range', '')) ?: null;
        $institution->overview = HtmlSanitizer::clean($request->input('overview'));

        // Facilities (JSON array)
        $facilities = $request->input('facilities', []);
        if (is_string($facilities)) {
            $decoded = json_decode($facilities, true);
            $facilities = is_array($decoded) ? $decoded : [];
        }
        $institution->facilities = array_values(array_unique(array_filter(array_map('trim', (array)$facilities))));

        // Category-Specific Details (JSON object)
        $details = $request->input('details', []);
        if (is_string($details)) {
            $decoded = json_decode($details, true);
            $details = is_array($decoded) ? $decoded : [];
        }
        if (is_array($details)) {
            foreach (['past_results', 'placement_highlights', 'scholarships', 'placement_stats'] as $richKey) {
                if (isset($details[$richKey]) && is_string($details[$richKey])) {
                    $details[$richKey] = HtmlSanitizer::clean($details[$richKey]);
                }
            }
        }
        $institution->details = $details;

        // File Uploads (Logo, Cover, Brochure PDF)
        if ($request->hasFile('logo')) {
            $institution->logo = self::storeFile($request->file('logo'), 'institutions/logos');
        }
        if ($request->hasFile('cover_image')) {
            $institution->cover_image = self::storeFile($request->file('cover_image'), 'institutions/covers');
        }
        if ($request->hasFile('brochure_pdf')) {
            $institution->brochure_pdf = self::storeFile($request->file('brochure_pdf'), 'institutions/brochures');
        }

        // Admin-only ownership & approval controls
        if ($isAdmin) {
            if ($request->has('user_id')) {
                $institution->user_id = $request->filled('user_id') ? (int)$request->input('user_id') : null;
            }
            if ($request->filled('verification_status')) {
                $vs = $request->input('verification_status');
                if (in_array($vs, ['pending', 'approved', 'rejected'], true)) {
                    $institution->verification_status = $vs;
                }
            }
            if ($request->has('verified_badge')) {
                $institution->verified_badge = filter_var($request->input('verified_badge'), FILTER_VALIDATE_BOOLEAN);
            }
            if ($request->has('is_active')) {
                $institution->is_active = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
            }
            if ($request->has('admin_notes')) {
                $institution->admin_notes = trim((string)$request->input('admin_notes', '')) ?: null;
            }
        }

        $institution->save();

        // Sync child programs if provided
        if ($request->has('programs')) {
            $programs = $request->input('programs');
            if (is_string($programs)) {
                $decoded = json_decode($programs, true);
                $programs = is_array($decoded) ? $decoded : [];
            }

            if (is_array($programs)) {
                $institution->programs()->delete();
                foreach ($programs as $idx => $prog) {
                    $progTitle = trim((string)($prog['title'] ?? ''));
                    if (empty($progTitle)) {
                        continue;
                    }
                    InstitutionProgram::create([
                        'institution_id' => $institution->id,
                        'title'          => $progTitle,
                        'level'          => trim((string)($prog['level'] ?? '')) ?: null,
                        'duration'       => trim((string)($prog['duration'] ?? '')) ?: null,
                        'mode'           => trim((string)($prog['mode'] ?? '')) ?: null,
                        'fee_amount'     => trim((string)($prog['fee_amount'] ?? '')) ?: null,
                        'seat_intake'    => trim((string)($prog['seat_intake'] ?? '')) ?: null,
                        'eligibility'    => trim((string)($prog['eligibility'] ?? '')) ?: null,
                        'description'    => trim((string)($prog['description'] ?? '')) ?: null,
                        'sort_order'     => $idx,
                    ]);
                }
            }
        }

        // Upload new gallery images if attached
        if ($request->hasFile('gallery_images')) {
            $files = $request->file('gallery_images');
            if (!is_array($files)) {
                $files = [$files];
            }
            $caption = trim((string)$request->input('gallery_caption', '')) ?: null;
            $category = trim((string)$request->input('gallery_category', 'Campus')) ?: 'Campus';

            foreach ($files as $file) {
                if (!$file || !$file->isValid()) {
                    continue;
                }
                $path = self::storeFile($file, 'institutions/gallery');
                InstitutionGallery::create([
                    'institution_id' => $institution->id,
                    'image_path'     => $path,
                    'caption'        => $caption,
                    'category'       => $category,
                ]);
            }
        }

        return $institution->fresh(['programs', 'galleries', 'user']);
    }

    /**
     * Store uploaded file into public/<folder> and return relative path.
     */
    public static function storeFile($file, string $folder): string
    {
        $dest = public_path($folder);
        File::ensureDirectoryExists($dest);

        $safeName = time() . '-' . Str::random(6) . '-' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
        $file->move($dest, $safeName);

        return '/' . trim($folder, '/') . '/' . $safeName;
    }
}
