<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseFaq;
use App\Helpers\HtmlSanitizer;
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'is_active' => 'nullable',
        ]);

        $course_faq = new CourseFaq;
        $course_faq->title       = $validated['title'];
        $course_faq->description = HtmlSanitizer::clean($validated['description']);
        $course_faq->is_active   = $request->is_active ?? 1;
        $course_faq->save();

        return redirect()->back()->withSuccess('Course FAQ added successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'is_active' => 'nullable',
        ]);

        $course_faq = CourseFaq::findOrFail($id);
        $course_faq->title       = $validated['title'];
        $course_faq->description = HtmlSanitizer::clean($validated['description']);
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
