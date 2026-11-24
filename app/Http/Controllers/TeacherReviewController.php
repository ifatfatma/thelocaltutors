<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TeacherReview;
use Common;
use App\Http\Requests\StoreTeacherReviewRequest;
use App\Http\Requests\UpdateTeacherReviewRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class TeacherReviewController extends Controller
{
    /**
     * Display a listing of the teacher reviews with moderation queue
     */
    public function index(Request $request)
    {
        $query = TeacherReview::with(['reviewer', 'teacher'])->latest('id');

        if ($request->has('status') && $request->status !== 'all' && $request->status !== '') {
            $query->where('is_active', $request->status === 'approved' ? 1 : 0);
        }

        $data = $query->paginate(50)->withQueryString();

        $stats = [
            'total' => TeacherReview::count(),
            'pending' => TeacherReview::where('is_active', 0)->count(),
            'approved' => TeacherReview::where('is_active', 1)->count(),
        ];

        return Inertia::render('Admin/TeacherReview/Index', [
            'teacher_review' => $data,
            'stats' => $stats,
            'currentStatus' => $request->status ?? 'all',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return redirect()->route('teacher_review.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeacherReviewRequest $request): RedirectResponse
    {
        $teacher_review = new TeacherReview;
        $teacher_review->student_id     = $request->student_id ?? 0;
        $teacher_review->teacher_id     = $request->teacher_id ?? 0;
        $teacher_review->teacher_review = $request->teacher_review ?? '';
        $teacher_review->teacher_rating = $request->teacher_rating ?? 5;
        $teacher_review->is_active      = $request->has('is_active') ? $request->is_active : 1;
        $teacher_review->save();
        return redirect()->back()->withSuccess('Teacher Review added successfully.');
    }

    /**
     * Approve review so it displays publicly on the website
     */
    public function accept($id)
    {
        $review = TeacherReview::findOrFail($id);
        $review->is_active = 1;
        $review->save();
        return redirect()->back()->withSuccess('Review approved! It will now be displayed publicly on the website.');
    }

    /**
     * Reject or unapprove review back to pending
     */
    public function reject($id)
    {
        $review = TeacherReview::findOrFail($id);
        $review->is_active = 0;
        $review->save();
        return redirect()->back()->withSuccess('Review unapproved and moved to pending moderation.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TeacherReview $teacher_review)
    {
        return redirect()->route('teacher_review.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TeacherReview $teacher_review)
    {
        return redirect()->route('teacher_review.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherReviewRequest $request, $id)
    {
        $teacher_review = TeacherReview::findOrFail($id);
        $teacher_review->student_id     = $request->student_id ?? 0;
        $teacher_review->teacher_id     = $request->teacher_id ?? 0;
        $teacher_review->teacher_review = $request->teacher_review ?? '';
        $teacher_review->teacher_rating = $request->teacher_rating ?? 0;
        if ($request->has('is_active')) {
            $teacher_review->is_active = $request->is_active;
        }
        $teacher_review->save();
        return redirect()->back()->withSuccess('Teacher Review updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $teacher_review = TeacherReview::findOrFail($id);
        $teacher_review->delete();
        return redirect()->back()->withSuccess('Review deleted successfully.');
    }
}
