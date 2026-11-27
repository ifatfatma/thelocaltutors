<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CustomData;
use App\Models\Teacher;
use App\Models\enrollCourse;
use Intervention\Image\Laravel\Facades\Image;
use File;

class TeacherCourseController extends Controller
{
    /**
     * Teacher portal: List all courses created by the logged-in teacher
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        $user = Auth::user();

        // Retrieve teacher's courses with category and enrollment counts
        $courses = Course::where('teacher_id', $userId)
            ->with('category')
            ->withCount('enrollments')
            ->latest('id')
            ->paginate(12)
            ->withQueryString();

        // Retrieve active course categories and subjects
        $categories = CourseCategory::where('is_active', 1)->orderBy('title', 'asc')->get();
        $subjects = CustomData::where('key_name', 'subject')->where('is_active', 1)->orderBy('name', 'asc')->get();
        $teacher = Teacher::where('user_id', $userId)->first();

        // Calculate summary metrics
        $allTeacherCourses = Course::where('teacher_id', $userId)->get();
        $totalCourses = $allTeacherCourses->count();
        $activeCourses = $allTeacherCourses->where('is_active', 1)->count();
        $allCourseIds = $allTeacherCourses->pluck('id');
        $totalEnrollments = enrollCourse::whereIn('course_id', $allCourseIds)->count();

        // Retrieve full list of students enrolled in this teacher's courses
        $enrolledStudents = enrollCourse::whereIn('course_id', $allCourseIds)
            ->with(['user', 'course'])
            ->latest('id')
            ->get();

        return Inertia::render('Dashboard/TeacherCourses', [
            'courses' => $courses,
            'enrolledStudents' => $enrolledStudents,
            'categories' => $categories,
            'subjects' => $subjects,
            'teacher' => $teacher,
            'stats' => [
                'total_courses' => $totalCourses,
                'active_courses' => $activeCourses,
                'total_enrollments' => $totalEnrollments,
                'commission_percent' => 5, // 5% platform commission
            ],
        ]);
    }

    /**
     * Teacher portal: Store a newly created course
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:192',
            'price' => 'required|numeric|min:0|max:1000000',
            'category_id' => 'nullable|integer',
            'duration' => 'nullable|string|max:100',
            'teaching_mode' => 'nullable',
            'target_level' => 'nullable|string|max:192',
            'educator_status' => 'nullable|string|max:192',
            'curriculum' => 'nullable|string|max:192',
            'description' => 'nullable|string|max:20000',
            'youtube_url' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
        ], [
            'name.required' => 'Please enter a title or topic name for your course.',
            'price.required' => 'Please set a course fee/price.',
            'price.numeric' => 'The course fee must be a valid number.',
            'price.min' => 'Course fee cannot be negative.',
            'image.max' => 'The thumbnail image may not be greater than 3 MB.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput()
                ->with('error', $validator->errors()->first());
        }

        $userId = Auth::id();
        $course = new Course();

        // Handle Image Upload
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            try {
                $imageFile = $request->file('image');
                $image = Image::read($imageFile);
                $cleanName = preg_replace('/[^A-Za-z0-9\._-]/', '', $imageFile->getClientOriginalName());
                $imageName = time() . '-' . $cleanName;

                $destPath = public_path('course/');
                if (!file_exists($destPath)) {
                    mkdir($destPath, 0777, true);
                }
                $image->save($destPath . $imageName);

                $destThumb = public_path('course/thumbnail/');
                if (!file_exists($destThumb)) {
                    mkdir($destThumb, 0777, true);
                }
                $image->resize(150, 150);
                $image->save($destThumb . $imageName);

                $course->image = $imageName;
            } catch (\Throwable $e) {
                return redirect()->back()->withInput()->with('error', 'Failed to process uploaded course image.');
            }
        }

        $course->name = trim($request->name);
        $course->price = (float)$request->price;
        $course->price_type = $request->price_type === 'per_month' ? 'per_month' : 'one_time';
        $course->duration = trim($request->duration ?? '');
        $course->target_level = !empty($request->target_level) ? trim($request->target_level) : null;
        $course->educator_status = !empty($request->educator_status) ? trim($request->educator_status) : null;
        $course->curriculum = !empty($request->curriculum) ? trim($request->curriculum) : null;
        $course->teacher_id = $userId;
        $course->category_id = $request->category_id ?: 0;

        // Teaching mode (Home, Online, Private)
        if (is_array($request->teaching_mode)) {
            $course->teaching_mode = implode(', ', array_filter($request->teaching_mode));
        } else {
            $course->teaching_mode = $request->teaching_mode ?: 'Home, Online';
        }

        $course->description = \App\Helpers\HtmlSanitizer::clean($request->description);
        $course->youtube_url = trim($request->youtube_url ?? '');
        $course->is_active = $request->has('is_active') ? (int)$request->is_active : 1;
        $course->save();

        $commission = round($course->price * 0.05, 2);
        $teacherNet = round($course->price * 0.95, 2);

        $msg = "Course '{$course->name}' published successfully at ₹" . number_format($course->price, 2) . 
               "! (Platform commission: 5% = ₹" . number_format($commission, 2) . 
               ", Your net payout: 95% = ₹" . number_format($teacherNet, 2) . ")";

        return redirect()->route('front.dashboard.courses')->with('success', $msg);
    }

    /**
     * Teacher portal: Update an existing course
     */
    public function update(Request $request, $id)
    {
        $userId = Auth::id();
        $course = Course::where('id', $id)
            ->where('teacher_id', $userId)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:192',
            'price' => 'required|numeric|min:0|max:1000000',
            'category_id' => 'nullable|integer',
            'duration' => 'nullable|string|max:100',
            'teaching_mode' => 'nullable',
            'target_level' => 'nullable|string|max:192',
            'educator_status' => 'nullable|string|max:192',
            'curriculum' => 'nullable|string|max:192',
            'description' => 'nullable|string|max:20000',
            'youtube_url' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput()
                ->with('error', $validator->errors()->first());
        }

        // Handle Image Upload if updated
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            try {
                $imageFile = $request->file('image');
                $image = Image::read($imageFile);
                $cleanName = preg_replace('/[^A-Za-z0-9\._-]/', '', $imageFile->getClientOriginalName());
                $imageName = time() . '-' . $cleanName;

                $destPath = public_path('course/');
                if (!file_exists($destPath)) {
                    mkdir($destPath, 0777, true);
                }
                $image->save($destPath . $imageName);

                $destThumb = public_path('course/thumbnail/');
                if (!file_exists($destThumb)) {
                    mkdir($destThumb, 0777, true);
                }
                $image->resize(150, 150);
                $image->save($destThumb . $imageName);

                $course->image = $imageName;
            } catch (\Throwable $e) {
                return redirect()->back()->withInput()->with('error', 'Failed to process uploaded course image.');
            }
        }

        $course->name = trim($request->name);
        $course->price = (float)$request->price;
        $course->price_type = $request->price_type === 'per_month' ? 'per_month' : 'one_time';
        $course->duration = trim($request->duration ?? '');
        $course->target_level = !empty($request->target_level) ? trim($request->target_level) : null;
        $course->educator_status = !empty($request->educator_status) ? trim($request->educator_status) : null;
        $course->curriculum = !empty($request->curriculum) ? trim($request->curriculum) : null;
        $course->category_id = $request->category_id ?: 0;

        if (is_array($request->teaching_mode)) {
            $course->teaching_mode = implode(', ', array_filter($request->teaching_mode));
        } elseif ($request->teaching_mode) {
            $course->teaching_mode = $request->teaching_mode;
        }

        $course->description = \App\Helpers\HtmlSanitizer::clean($request->description);
        $course->youtube_url = trim($request->youtube_url ?? '');
        if ($request->has('is_active')) {
            $course->is_active = (int)$request->is_active;
        }
        $course->save();

        $commission = round($course->price * 0.05, 2);
        $teacherNet = round($course->price * 0.95, 2);

        $msg = "Course '{$course->name}' updated! Fee: ₹" . number_format($course->price, 2) . 
               " (Platform commission: 5% = ₹" . number_format($commission, 2) . 
               ", Net payout: 95% = ₹" . number_format($teacherNet, 2) . ")";

        return redirect()->route('front.dashboard.courses')->with('success', $msg);
    }

    /**
     * Teacher portal: Delete a course
     */
    public function destroy($id)
    {
        $userId = Auth::id();
        $course = Course::where('id', $id)
            ->where('teacher_id', $userId)
            ->firstOrFail();

        $courseName = $course->name;
        $course->delete();

        return redirect()->route('front.dashboard.courses')
            ->with('success', "Course '{$courseName}' has been removed successfully.");
    }

    /**
     * Teacher portal: Toggle active status
     */
    public function toggleStatus($id)
    {
        $userId = Auth::id();
        $course = Course::where('id', $id)
            ->where('teacher_id', $userId)
            ->firstOrFail();

        $course->is_active = $course->is_active ? 0 : 1;
        $course->save();

        $statusStr = $course->is_active ? 'Active & Published' : 'Draft / Paused';
        return redirect()->route('front.dashboard.courses')
            ->with('success', "Course status changed to {$statusStr}.");
    }

    /**
     * Teacher portal: Update student enrollment status (accepted, completed, canceled)
     */
    public function updateEnrollmentStatus(Request $request, $id)
    {
        $userId = Auth::id();
        $allTeacherCourseIds = Course::where('teacher_id', $userId)->pluck('id');
        $enrollment = enrollCourse::whereIn('course_id', $allTeacherCourseIds)->findOrFail($id);
        
        if (in_array($request->status, ['pending', 'accepted', 'completed', 'canceled'])) {
            $enrollment->status = $request->status;
            $enrollment->save();
        }

        return redirect()->back()->with('success', 'Student enrollment status updated.');
    }
}
