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
Route::get('coursefeedback',[CourseController::class,'coursefeedback'])->name('coursefeedback.list');
Route::get('coursefeedback/accept/{id}',[CourseController::class,'acceptcoursefeedback'])->name('coursefeedback.accept');
Route::delete('feedback/{id}/delete',[CourseController::class,'destroycoursefeedback'])->name('coursefeedback.destroy');
Route::get('blogfeedback',[BlogController::class,'blogfeedback'])->name('blogfeedback.list');
Route::get('blogfeedback/accept/{id}',[BlogController::class,'acceptblogfeedback'])->name('blogfeedback.accept');
Route::delete('blogfeedback/{id}/delete',[BlogController::class,'destroyblogfeedback'])->name('blogfeedback.destroy');

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

Route::get('/team',[FrontController::class, 'team'])->name('front.team');
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
Route::get('getTeamTeacherDetailsAjax/{id}', [FrontController::class, 'getTeamTeacherDetailsAjax'])->name('front.ajax.get.team.teacher.details');
Route::get('getCourseVideoAjax/{courseid}', [FrontController::class, 'getCourseVideoAjax'])->name('front.ajax.get.course.video'); 
Route::get('postTeacherReviews', [FrontController::class, 'postTeacherReviews'])->name('front.ajax.post.teacher.feedback');

