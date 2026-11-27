<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Support\Str;

use App\Models\CourseCategory;
use App\Http\Requests\StoreCourseCategoryRequest;
use App\Http\Requests\UpdateCourseCategoryRequest;
use App\Helpers\HtmlSanitizer;
use Intervention\Image\Laravel\Facades\Image;
use File;
use Inertia\Inertia;


class CourseCategoryController extends Controller
{ 
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = CourseCategory::latest('id');
        $data = $data->paginate(50)->withQueryString();
        return Inertia::render('Admin/CourseCategory/Index', [
            'course_category' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/CourseCategory/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseCategoryRequest $request)
    {
        $courseCategory = new CourseCategory;
        if(!empty($request->file('image'))){
            try {
                $image = Image::read($request->file('image'));
                $imageName = time().'-'.$request->file('image')->getClientOriginalName();
                $destinationPath = public_path('coursecategory/');
                $destinationPathThumbnail = public_path('coursecategory/thumbnail/');
                \Illuminate\Support\Facades\File::ensureDirectoryExists($destinationPath);
                \Illuminate\Support\Facades\File::ensureDirectoryExists($destinationPathThumbnail);
                $image->save($destinationPath.$imageName);
                $image->resize(100,100);
                $image->save($destinationPathThumbnail.$imageName);
                $courseCategory->image = $imageName;
            } catch (\Throwable $e) {
                return redirect()->back()->withInput()->with('error', 'Failed to process uploaded image: ' . $e->getMessage());
            }
        }
        $courseCategory->slug        = Str::slug($request->title,'-');
        $courseCategory->title       = $request->title??'';
        $courseCategory->description = HtmlSanitizer::clean($request->description ?? '');
        $courseCategory->is_active   = $request->is_active??'';
        $courseCategory->save();
        //dd($courseCategory);
        return redirect('admin/course_category')->withSuccess('Course Category is added successfully.');
    }
    

    /**
     * Display the specified resource.
     */
    public function show(CourseCategory $courseCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseCategory $courseCategory)
    {
        return Inertia::render('Admin/CourseCategory/Edit', ['course_category' => $courseCategory]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseCategoryRequest $request,$id)
    {
        $courseCategory = CourseCategory::findorfail($id);
        if(!empty($request->file('image'))){
            try {
                $image = Image::read($request->file('image'));
                $imageName = time().'-'.$request->file('image')->getClientOriginalName();
                $destinationPath = public_path('coursecategory/');
                $destinationPathThumbnail = public_path('coursecategory/thumbnail/');
                \Illuminate\Support\Facades\File::ensureDirectoryExists($destinationPath);
                \Illuminate\Support\Facades\File::ensureDirectoryExists($destinationPathThumbnail);
                $image->save($destinationPath.$imageName);
                $image->resize(100,100);
                $image->save($destinationPathThumbnail.$imageName);
                $courseCategory->image = $imageName;
            } catch (\Throwable $e) {
                return redirect()->back()->withInput()->with('error', 'Failed to process uploaded image: ' . $e->getMessage());
            }
        }
        $courseCategory->slug        = Str::slug($request->title,'-');
        $courseCategory->title       = $request->title??'';
        $courseCategory->description = HtmlSanitizer::clean($request->description ?? '');
        $courseCategory->is_active   = $request->is_active??'';
        $courseCategory->save();
       // dd($courseCategory);

        return redirect()->back()
        ->withSuccess('Information is updated successfully.'); 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $courseCategory = CourseCategory::findorfail($id);
        $courseCategory->delete();
        return redirect()->back()
                ->withSuccess('Record is deleted successfully.');
    }
}
