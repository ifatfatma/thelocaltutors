<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\View\View;
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
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = TeacherReview::with(['reviewer','teacher'])->latest('id');
        $data = $data->paginate(50)->withQueryString();
        return Inertia::render('Admin/TeacherReview/Index', [
            'teacher_review' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create():View
    {
        $teacherlist = User::where('type','teacher')->orderBy('name','asc')->get();
        $studentlist = User::where('type','student')->orderBy('name','asc')->get();
        return view('teacher_review.create',compact('teacherlist','studentlist'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeacherReviewRequest $request): RedirectResponse
    {
        $teacher_review = new TeacherReview;
        $teacher_review->student_id     = $request->student_id??0;
        $teacher_review->teacher_id     = $request->teacher_id??0;
        $teacher_review->teacher_review = $request->teacher_review??'';
        $teacher_review->teacher_rating = $request->teacher_rating??0;
        $teacher_review->save();
        return redirect()->back()->withSuccess('Teacher Review added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TeacherReview $teacher_review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TeacherReview $teacher_review)
    {
        $teacherlist = User::where('type','teacher')->orderBy('name','asc')->get();
        $studentlist = User::where('type','student')->orderBy('name','asc')->get();
        return view('teacher_review.edit',['teacher_review'=>$teacher_review],compact('teacherlist','studentlist'));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherReviewRequest $request, $id)
    {
        $teacher_review = TeacherReview::findorfail($id);
        $teacher_review->student_id     = $request->student_id??0;
        $teacher_review->teacher_id     = $request->teacher_id??0;
        $teacher_review->teacher_review = $request->teacher_review??'';
        $teacher_review->teacher_rating = $request->teacher_rating??0;
        $teacher_review->save();
        return redirect()->back()->withSuccess('Teacher Review updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $teacher_review = TeacherReview::findorfail($id);
        $teacher_review->delete();
        return redirect()->back()->withSuccess('Record is deleted successfully.');
    }
}
