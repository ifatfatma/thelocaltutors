<?php

namespace App\Http\Controllers;

use App\Http\Middleware\EnsureUserRole;
use App\Models\Institution;
use App\Models\InstitutionInquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PublicInstitutionController extends Controller
{
    /**
     * Public Tabbed Institution Detail Page
     */
    public function show(string $slug)
    {
        $institution = Institution::with(['programs', 'galleries'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Only approved & active institutions are publicly visible (owner or admin may preview)
        $user = Auth::user();
        $isAdmin = EnsureUserRole::userHasAnyRole($user, ['admin']);
        $isOwner = $user && (int)$institution->user_id === (int)$user->id;

        if ((!$institution->is_active || $institution->verification_status !== 'approved') && !$isAdmin && !$isOwner) {
            abort(404);
        }

        return Inertia::render('Front/InstitutionDetails', [
            'institution' => $institution,
        ]);
    }

    /**
     * Submit Student Admission Inquiry / Callback Request
     */
    public function submitInquiry(Request $request, $id)
    {
        $institution = Institution::publiclyVisible()->findOrFail($id);

        $validated = $request->validate([
            'student_name'     => 'required|string|max:191',
            'student_phone'    => 'required|string|max:40',
            'student_email'    => 'nullable|email|max:191',
            'program_interest' => 'nullable|string|max:191',
            'message'          => 'nullable|string|max:2000',
        ]);

        InstitutionInquiry::create([
            'institution_id'   => $institution->id,
            'user_id'          => Auth::id(),
            'student_name'     => trim($validated['student_name']),
            'student_phone'    => trim($validated['student_phone']),
            'student_email'    => isset($validated['student_email']) ? trim($validated['student_email']) : null,
            'program_interest' => isset($validated['program_interest']) ? trim($validated['program_interest']) : null,
            'message'          => isset($validated['message']) ? trim($validated['message']) : null,
            'status'           => 'new',
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Your admission inquiry has been submitted! ' . $institution->name . ' will contact you shortly.',
            ]);
        }

        return redirect()->back()->with('success', 'Your admission inquiry has been submitted!');
    }
}
