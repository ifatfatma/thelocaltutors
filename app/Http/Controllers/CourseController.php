<?php 

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Support\Str;

use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseFeedback;
use App\Models\User;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use Illuminate\Http\RedirectResponse;
use Common;
use Intervention\Image\Laravel\Facades\Image;
use File;
use Inertia\Inertia;
 

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = Course::with('teacher','category')->latest('id');
        $data = $data->paginate(50)->withQueryString();
        return Inertia::render('Admin/Courses/Index', [
            'courses' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $teacherlist = User::where('type','teacher')->orderBy('name','asc')->get();
        $coursecatlist = CourseCategory::where('is_active',1)->orderBy('title','asc')->get();
        return Inertia::render('Admin/Courses/Create',compact('teacherlist','coursecatlist'));

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $course = new Course;
        if(!empty($request->file('image'))){
        $image = Image::read($request->file('image'));

        // Main Image Upload on Folder Code
        $imageName = time().'-'.$request->file('image')->getClientOriginalName();
        $destinationPath = public_path('course/');
        $image->save($destinationPath.$imageName);

        // Generate Thumbnail Image Upload on Folder Code
        $destinationPathThumbnail = public_path('course/thumbnail/');
        $image->resize(100,100);
        $image->save($destinationPathThumbnail.$imageName);
        $course->image = $imageName;
        }
        $course->category_id  = $request->category_id??0;
        $course->slug         = Str::slug($request->name);
        $course->name         = $request->name??'';
        $course->duration     = $request->duration??0;
        $course->price        = $request->price??0;
        $course->teaching_mode= !empty($request->teaching_mode)?implode(',',$request->teaching_mode):NULL;
        $course->teacher_id   = $request->teacher_id??0;
        $course->description  = $request->description??'';
        $course->youtube_url  =$request->youtube_url??'';
        $course->is_active    = $request->is_active??0;
        $course->save();
        return redirect()->back()->withSuccess('Course added successfully.');
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        $teacherlist = User::where('type','teacher')->orderBy('name','asc')->get();
        $coursecatlist = CourseCategory::where('is_active',1)->orderBy('title','asc')->get();

        return Inertia::render('Admin/Courses/Edit', [
            'course' => $course,
            'teacherlist' => $teacherlist,
            'coursecatlist' => $coursecatlist
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseRequest $request, $id)
    {
        $course = Course::findorfail($id);
        if(!empty($request->file('image'))){
        $image = Image::read($request->file('image'));

        // Main Image Upload on Folder Code
        $imageName = time().'-'.$request->file('image')->getClientOriginalName();
        $destinationPath = public_path('course/');
        $image->save($destinationPath.$imageName);

        // Generate Thumbnail Image Upload on Folder Code
        $destinationPathThumbnail = public_path('course/thumbnail/');
        $image->resize(100,100);
        $image->save($destinationPathThumbnail.$imageName);
        $course->image = $imageName;
        }
        $course->category_id  = $request->category_id??0;
        $course->slug         = Str::slug($request->name);
        $course->name         = $request->name??'';
        $course->duration     = $request->duration??0;
        $course->price        = $request->price??0;
        $course->teaching_mode= !empty($request->teaching_mode)?implode(',',$request->teaching_mode):NULL;
        $course->teacher_id   = $request->teacher_id??0;
        $course->description  = $request->description??'';
        $course->youtube_url  = $request->youtube_url??'';
        $course->is_active    = $request->is_active??0;
        $course->save();
        return redirect()->back()->withSuccess('Course updated successfully.');
    }
 
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $course = Course::findorfail($id);
        $course->delete();
        return redirect()->back()
                ->withSuccess('Record is deleted successfully.');
    }

    public function coursefeedback(Request $request)
    {
        $coursefeedback = CourseFeedback::with('user','course')->latest('id');
        $coursefeedback = $coursefeedback->paginate(50)->withQueryString();
        return Inertia::render('Admin/Feedback/CourseFeedback',compact('coursefeedback'));
    }

    public function acceptcoursefeedback($id)
    {
        $coursefeedback = CourseFeedback::findorfail($id);
        $coursefeedback->is_active = 1;
        $coursefeedback->save();
        return redirect()->back()->withSuccess('Feedback Accepted');
    }

    public function destroycoursefeedback($id)
    {
        $coursefeedback = CourseFeedback::findorfail($id);
        $coursefeedback->forceDelete();
        return redirect()->back()->withSuccess('Feedback deleted successfully.');
    }
 
}
