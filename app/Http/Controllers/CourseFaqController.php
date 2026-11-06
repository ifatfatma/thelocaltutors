<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseFaq;
use Inertia\Inertia;

class CourseFaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */ 
    public function index(Request $request)
    {
        $data = CourseFaq::latest('id')->paginate(50)->withQueryString();

        return Inertia::render('Admin/CourseFaq/Index', [
            'course_faq' => $data
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $course_faq = new CourseFaq;
        $course_faq->title       = $request->title ?? '';
        $course_faq->description = $request->description ?? '';
        $course_faq->is_active   = $request->is_active ?? 1;
        $course_faq->save();

        return redirect()->back()->withSuccess('Course FAQ added successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $course_faq = CourseFaq::findOrFail($id);
        $course_faq->title       = $request->title ?? '';
        $course_faq->description = $request->description ?? '';
        $course_faq->is_active   = $request->is_active ?? 1;
        $course_faq->save();

        return redirect()->back()->withSuccess('Information updated successfully.'); 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $course_faq = CourseFaq::findOrFail($id);
        $course_faq->delete();

        return redirect()->back()->withSuccess('Record deleted successfully.');
    }
}
