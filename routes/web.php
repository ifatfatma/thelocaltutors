<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\CustomDataController;
use App\Http\Controllers\GeneralSettingController;
use App\Http\Controllers\SinglePageController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseCategoryController;
use App\Http\Controllers\Front\FrontController;
use App\Http\Controllers\Front\FrontAuthController;
use App\Http\Controllers\Front\FontDashboardController;
use App\Http\Controllers\Front\FrontUserController;
use App\Http\Controllers\TeacherReviewController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\ContactUsController;
use App\Http\Controllers\CourseFaqController;
use App\Http\Controllers\Installer\InstallController;
use App\Http\Controllers\TeacherDemoController;
use App\Http\Controllers\TeacherCourseController;

// Web Installer Routes
Route::prefix('install')->name('install.')->group(function () {
    Route::get('/', [InstallController::class, 'index'])->name('index');
    Route::get('/database', [InstallController::class, 'database'])->name('database');
    Route::post('/database/test', [InstallController::class, 'testDatabase'])->name('database.test');
    Route::post('/database/save', [InstallController::class, 'saveDatabase'])->name('database.save');
    Route::get('/admin', [InstallController::class, 'admin'])->name('admin');
    Route::post('/process', [InstallController::class, 'process'])->name('process');
    Route::get('/finish', [InstallController::class, 'finish'])->name('finish');
});

Auth::routes();
 

Route::prefix('admin')->group(function () {
      Route::get('/', function () {
        return redirect()->route('login');
    }); 
Route::post('/logout', [LoginController::class, 'logout'])->name('admin.logout');
Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('teacher/updatemore/{id}', [TeacherController::class, 'updateview'])->name('teacher.updatemore');
Route::post('teacher/updatemore/post/{id}', [TeacherController::class, 'updatemore'])->name('teacher.updatemore.post');
Route::get('generalsettings', [GeneralSettingController::class, 'index'])->name('generalsettings.index');
Route::post('import', [CustomDataController::class, 'import'])->name('customdata.import.post');
Route::get('settings', [GeneralSettingController::class, 'index'])->name('settings.index');
Route::post('settingpost', [GeneralSettingController::class, 'addsettings'])->name('settings.post');
Route::get('getDistrictAjax/{id}', [CustomDataController::class, 'getDistrictAjax'])->name('customdata.ajax.get.district');
Route::get('getCityAjax/{id}', [CustomDataController::class, 'getDistrictAjax'])->name('customdata.ajax.get.cities');
//message
Route::get('messages/view/{id}',[ContactUsController::class,'view'])->name('messages.view');
Route::get('teacher-demos', [TeacherDemoController::class, 'adminIndex'])->name('admin.teacher_demos.index');
Route::post('teacher-demos/{id}/status', [TeacherDemoController::class, 'adminUpdateStatus'])->name('admin.teacher_demos.status');
Route::delete('teacher-demos/{id}', [TeacherDemoController::class, 'adminDestroy'])->name('admin.teacher_demos.destroy');
Route::post('demo-shares/create', [TeacherDemoController::class, 'adminShareDemo'])->name('admin.demo_shares.create');
Route::get('demo-shares', [TeacherDemoController::class, 'adminSharesList'])->name('admin.demo_shares.index');
Route::delete('demo-shares/{id}', [TeacherDemoController::class, 'adminShareDelete'])->name('admin.demo_shares.destroy');
Route::get('coursefeedback',[CourseController::class,'coursefeedback'])->name('coursefeedback.list');
Route::get('coursefeedback/accept/{id}',[CourseController::class,'acceptcoursefeedback'])->name('coursefeedback.accept');
Route::delete('feedback/{id}/delete',[CourseController::class,'destroycoursefeedback'])->name('coursefeedback.destroy');
Route::get('blogfeedback',[BlogController::class,'blogfeedback'])->name('blogfeedback.list');
Route::get('blogfeedback/accept/{id}',[BlogController::class,'acceptblogfeedback'])->name('blogfeedback.accept');
Route::delete('blogfeedback/{id}/delete',[BlogController::class,'destroyblogfeedback'])->name('blogfeedback.destroy');

// Teacher Reviews Moderation (Approve / Reject)
Route::get('teacher_review/accept/{id}', [TeacherReviewController::class, 'accept'])->name('teacher_review.accept');
Route::get('teacher_review/reject/{id}', [TeacherReviewController::class, 'reject'])->name('teacher_review.reject');

// Platform Feedback Moderation
Route::get('platform-feedback', [FrontController::class, 'adminPlatformFeedback'])->name('admin.platform_feedback.index');
Route::get('platform-feedback/accept/{id}', [FrontController::class, 'acceptPlatformFeedback'])->name('admin.platform_feedback.accept');
Route::delete('platform-feedback/{id}', [FrontController::class, 'destroyPlatformFeedback'])->name('admin.platform_feedback.destroy');

Route::resources([
    'roles'           => RoleController::class,
    'users'           => UserController::class,
    'teacher'         => TeacherController::class,
    'customdata'      => CustomDataController::class,
    'singlepages'     => SinglePageController::class,
    'faq'             => FaqController::class,
    'course_category' => CourseCategoryController::class,
    'course'          => CourseController::class,
    'teacher_review'  => TeacherReviewController::class,
    'blog'            => BlogController::class,
    'gallery'         => GalleryController::class,
    'couse_faq'       => CourseFaqController::class,
    'messages'         => ContactUsController::class,
]);

});

Route::get('/',[FrontController::class, 'index'])->name('front.index');
Route::get('/about',[FrontController::class, 'about'])->name('front.about');
Route::get('/contact',[FrontController::class, 'contact'])->name('front.contact');
Route::post('/contactpost',[FrontController::class, 'contactpost'])->name('front.contact.post');
Route::get('/forgotpassword',[FrontController::class, 'forgotpassword'])->name('front.forgotpasswords');
Route::get('/ourmission',[FrontController::class, 'ourmission'])->name('front.ourmission');
Route::get('/ourvision',[FrontController::class, 'ourvision'])->name('front.ourvision');
Route::get('/addteacher',[FrontController::class, 'addteacher'])->name('front.addteacher');
Route::get('/all_course',[FrontController::class, 'all_course'])->name('front.all_course');
Route::get('/blog_details/{blogid}',[FrontController::class, 'blog_details'])->name('front.blog_details');
Route::get('/blog',[FrontController::class, 'blog'])->name('front.blog');
Route::get('/blogs',[FrontController::class, 'blog_list'])->name('front.blog.list');

//b;pg feedback
Route::get('/blogfeedbackpost',[FrontController::class, 'blog_feedback'])->name('front.blog.feedback.post');

Route::get('/cart',[FrontController::class, 'cart'])->name('front.cart');
Route::get('/checkout',[FrontController::class, 'checkout'])->name('front.checkout');
Route::get('/course_details/{courseid}/{slug}',[FrontController::class, 'course_details'])->name('front.course_details');
//course feedback
Route::get('/feedbackpost',[FrontController::class, 'course_feedback'])->name('front.feedback.post');
Route::get('/course/{catid}/{slug}',[FrontController::class, 'course_list'])->name('front.course_list');
Route::get('/event_details',[FrontController::class, 'event_details'])->name('front.event_details');
Route::get('/event_sidebar',[FrontController::class, 'event_sidebar'])->name('front.event_sidebar');
Route::get('/event',[FrontController::class, 'event'])->name('front.event');
Route::get('/faq',[FrontController::class, 'faq'])->name('front.faq');
Route::get('/eventgallery',[FrontController::class, 'gallery'])->name('front.gallery');
Route::get('/otp',[FrontController::class, 'otp'])->name('front.otp');
Route::get('/setting',[FrontController::class, 'setting'])->name('front.setting');
Route::get('/shop_dtails',[FrontController::class, 'shop_dtails'])->name('front.shop_dtails');
Route::get('/shop',[FrontController::class, 'shop'])->name('front.shop');
Route::get('/studentinterface',[FrontController::class, 'studentinterface'])->name('front.studentinterface');
Route::get('/search',[FrontController::class, 'search'])->name('front.search');
Route::get('/demo-view/{token}', [TeacherDemoController::class, 'publicDemoView'])->name('front.demo.view');
Route::post('/demo-view/{token}/confirm', [TeacherDemoController::class, 'confirmDemoBooking'])->name('front.demo.confirm');
Route::post('/platform-feedback', [FrontController::class, 'postPlatformFeedback'])->name('front.platform_feedback.submit');

Route::get('/team',[FrontController::class, 'team'])->name('front.team');
Route::get('/subjects',[FrontController::class, 'subjects'])->name('front.subjects');
Route::get('/get_lonlat',[FrontController::class, 'get_lonlat'])->name('front.get_lonlat');
Route::get('/myfavcourse/ajax',[FrontController::class, 'addmyfavcourse'])->name('front.addmyfavcourse'); 

Route::get('/enrollcourse/ajax',[FrontController::class, 'enrollcourse'])->name('front.enrollcourse'); 
Route::get('/savelatlong/{lt}/{lg}',[FrontController::class, 'savelatlong'])->name('front.savelatlong.save'); 


Route::get('/login',[FrontController::class, 'login'])->name('front.login');
Route::get('/register',[FrontController::class, 'register'])->name('front.register');
Route::post('/RegisterPost',[FrontAuthController::class, 'RegisterPost'])->name('front.RegisterPost');
Route::post('/RegisterPostOtp',[FrontAuthController::class, 'RegisterPostOtp'])->name('front.RegisterPostOtp');
Route::post('/LoginPost',[FrontAuthController::class, 'LoginPost'])->name('front.LoginPost');

Route::group(['middleware'=>'auth'],function(){
    
    Route::get('/searchhistory/result/{id}',[FrontController::class, 'showsearchresult'])->name('front.show.search');
Route::get('/searchhistory',[FrontController::class, 'searchhistory'])->name('front.search.history');
Route::delete('/searchhistory/{id}/delete',[FrontController::class,'searchdestroy'])->name('searchhistory.destroy');


    Route::get('/dashboard',[FontDashboardController::class, 'index'])->name('front.dashboard.index');
    Route::get('/changepassword',[FrontController::class, 'changepassword'])->name('front.changepassword');
    Route::get('/myfavouritecourses',[FrontController::class, 'myfavouritecourses'])->name('front.myfavouritecourses'); 
    Route::get('/mycourses',[FrontController::class, 'mycourses'])->name('front.mycourses'); 
    Route::get('/dashboard/demos', [TeacherDemoController::class, 'teacherIndex'])->name('front.dashboard.demos');
    Route::post('/dashboard/demos', [TeacherDemoController::class, 'teacherStore'])->name('front.dashboard.demos.store');
    Route::delete('/dashboard/demos/{id}', [TeacherDemoController::class, 'teacherDestroy'])->name('front.dashboard.demos.destroy');

    // Teacher Course Management Routes (Add course, set custom price with 5% commission)
    Route::get('/dashboard/courses', [TeacherCourseController::class, 'index'])->name('front.dashboard.courses');
    Route::post('/dashboard/courses', [TeacherCourseController::class, 'store'])->name('front.dashboard.courses.store');
    Route::post('/dashboard/courses/{id}/update', [TeacherCourseController::class, 'update'])->name('front.dashboard.courses.update');
    Route::delete('/dashboard/courses/{id}', [TeacherCourseController::class, 'destroy'])->name('front.dashboard.courses.destroy');
    Route::post('/dashboard/courses/{id}/toggle', [TeacherCourseController::class, 'toggleStatus'])->name('front.dashboard.courses.toggle');
    Route::post('/dashboard/courses/enrollment/{id}/status', [TeacherCourseController::class, 'updateEnrollmentStatus'])->name('front.dashboard.courses.enrollment.status');
    Route::post('ChangePasswordPost',[FontDashboardController::class,'ChangePasswordPost'])->name('front.changepassword.post'); 
    Route::post('/logout',[FontDashboardController::class, 'logout'])->name('front.logout');

    Route::get('/editprofile',[FrontUserController::class, 'editprofile'])->name('front.editprofile');
    Route::post('EditProfilePost',[FrontUserController::class,'EditProfilePost'])->name('front.EditProfilePost.post');
    Route::post('EditUserProfilePost',[FrontUserController::class,'EditUserProfilePost'])->name('front.EditUserProfilePost.post');
    
});

//Ajax
Route::get('/get-states',[FrontUserController::class, 'getStates'])->name('front.get.states');
Route::get('/get-districts',[FrontUserController::class, 'getDistricts'])->name('front.get.districts');
Route::get('/get-cities',[FrontUserController::class, 'getCities'])->name('front.get.cities');
Route::get('/get-user-details',[FrontUserController::class, 'getUsersDetails'])->name('front.get.users');

Route::get('getDistrictAjax/{id}', [FrontController::class, 'getDistrictAjax'])->name('front.ajax.get.district');
Route::get('getCityAjax/{id}', [FrontController::class, 'getDistrictAjax'])->name('front.ajax.get.cities');
Route::get('getprofileDistrictAjax/{id}', [FrontController::class, 'getDistrictAjax'])->name('front.profile.ajax.get.district');
Route::get('getprofileCityAjax/{id}', [FrontController::class, 'getDistrictAjax'])->name('front.profile.ajax.get.cities');
Route::get('getTeacherDetailsAjax/{id}', [FrontController::class, 'getTeacherDetailsAjax'])->name('front.ajax.get.teacher.details');
Route::get('getNearbyShowcaseTeachersAjax', [FrontController::class, 'getNearbyShowcaseTeachersAjax'])->name('front.ajax.showcase.teachers');
Route::get('getTeamTeacherDetailsAjax/{id}', [FrontController::class, 'getTeamTeacherDetailsAjax'])->name('front.ajax.get.team.teacher.details');
Route::get('getCourseVideoAjax/{courseid}', [FrontController::class, 'getCourseVideoAjax'])->name('front.ajax.get.course.video'); 
Route::get('postTeacherReviews', [FrontController::class, 'postTeacherReviews'])->name('front.ajax.post.teacher.feedback');

// Resolve Google Maps short links (e.g. maps.app.goo.gl) to extract exact lat/lng
Route::post('/resolve-maps-url', function (\Illuminate\Http\Request $request) {
    $rawUrl = trim($request->input('url', ''));
    if (empty($rawUrl)) {
        return response()->json(['success' => false, 'message' => 'Empty URL provided.'], 400);
    }

    if (!preg_match('/^https?:\/\/(?:[a-zA-Z0-9-]+\.)*(?:goo\.gl|google\.[a-z.]+)\//i', $rawUrl)) {
        return response()->json(['success' => false, 'message' => 'Not a valid Google Maps URL.'], 400);
    }

    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $rawUrl);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        curl_exec($ch);
        $finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        curl_close($ch);

        if (!$finalUrl) {
            $finalUrl = $rawUrl;
        }

        // 1. @lat,lng
        if (preg_match('/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/', $finalUrl, $m)) {
            return response()->json([
                'success' => true,
                'lat' => (float)$m[1],
                'lng' => (float)$m[2],
                'source' => $finalUrl,
            ]);
        }

        // 2. !3dLat!4dLng
        if (preg_match('/!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/', $finalUrl, $m)) {
            return response()->json([
                'success' => true,
                'lat' => (float)$m[1],
                'lng' => (float)$m[2],
                'source' => $finalUrl,
            ]);
        }

        // 3. ?q=lat,lng or &query=lat,lng
        if (preg_match('/[?&](?:q|query|daddr|ll)=(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/', $finalUrl, $m)) {
            return response()->json([
                'success' => true,
                'lat' => (float)$m[1],
                'lng' => (float)$m[2],
                'source' => $finalUrl,
            ]);
        }

        return response()->json([
            'success' => false,
            'final_url' => $finalUrl,
            'message' => 'Could not extract coordinates from the resolved URL.',
        ], 422);
    } catch (\Throwable $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
})->name('front.resolve.maps.url');


