<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Models\CourseCategory;
use App\Models\User;
use App\Models\SinglePage;


class FrontController extends Controller
{
    public function index(){
        $coursecategory = CourseCategory::all();
        $pageData = SinglePage::where('id',5)->first();

        return view('front.pages,home.index',compact('coursecategory','pageData'));
    }
    public function about(){
        return view('front.pages.about');
    }
    public function changepassword(){
        return view('front.pages.changepassword');
    }
    public function contact(){
        return view('front.pages.contact');
    }
    public function forgotpassword(){
        return view('front.pages.forgotpassword');
    }
    public function ourmission(){
        return view('front.pages.ourmission');
    }
    public function ourvision(){
        return view('front.pages.ourvision');
    }
    public function register(){
        return view('front.pages.register');
    }
    public function addteacher(){
        return view('front.pages.addteacher');
    }
    public function all_course(){
        return view('front.pages.allcourse');
    }
    public function blog_details(){
        return view('front.pages.blog_details');
    }
    public function blog(){
        return view('front.pages.blog');
    }
    public function cart(){
        return view('front.pages.cart');
    }
    public function checkout(){
        return view('front.pages.checkout');
    }
    public function course_details(){
        return view('front.pages.course_details');
    }
    public function course_list(){
        return view('front.pages.course_list');
    }
    public function event_details(){
        return view('front.pages.event_details');
    }
    public function event_sidebar(){
        return view('front.pages.event_sidebar');
    }
    public function event(){
        return view('front.pages.event');
    }
    public function faq(){
        return view('front.pages.faq');
    }
    public function gallery(){
        return view('front.pages.gallery');
    }
    public function login(){
        return view('front.pages.login');
    }
    public function otp(){
        return view('front.pages.otp');
    }
    public function setting(){
        return view('front.pages.setting');
    }
    public function shop_dtails(){
        return view('front.pages.shop_details');
    }
    public function shop(){
        return view('front.pages.shop');
    }
    public function student(){
        return view('front.pages.student');
    }
    public function studentinterface(){
        return view('front.pages.studentinterface');
    }
    public function teachers(){
        return view('front.pages.teachers');
    }
    public function team(){
        return view('front.pages.team');
    }
}
