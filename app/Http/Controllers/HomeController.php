<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Course;
use App\Models\Blog;
use App\Models\ContactUs;
use App\Models\TeacherReview;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $counts = [
            'users' => User::count(),
            'teachers' => Teacher::count(),
            'courses' => Course::count(),
            'blogs' => Blog::count(),
            'messages' => ContactUs::count(),
            'reviews' => TeacherReview::count(),
        ];

        return Inertia::render('Admin/Dashboard', compact('counts'));
    }
}
