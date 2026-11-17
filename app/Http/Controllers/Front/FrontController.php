<?php

namespace App\Http\Controllers\Front;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseFeedback;
use App\Models\BlogFeedback;
use App\Models\CourseFavourite;
use App\Models\ContactUs;
use App\Models\SinglePage;
use App\Models\enrollCourse;
use App\Models\CustomData;
use App\Models\TeacherReview;
use App\Models\Blog;
use App\Models\Search;
use App\Models\Faq;
use App\Models\FavouriteCourse;



use App\Http\Controllers\Common;
use Auth;

use App\Models\User;
use App\Models\Teacher;

class FrontController extends Controller
{
        public function getTeacherDetailsAjax($id){
        $tchtxt='';
        $teacherinfo = User::with('teachermore')->where('id',$id)->first();    
        if(!empty($teacherinfo->id)){
          $tchtxt.='<ul class="list-group">';  
          $profileimg = ''; 
          $tchtxt.='<li class="list-group-item text-center "><img style="border-radius:5px;" src="'.Common::profileimage($teacherinfo->image).'" height="150"></li>';
          if(!empty($teacherinfo->name)){
          $tchtxt.='<li class="list-group-item"><label class="profiletitle">NAME</label>'.($teacherinfo->name??'--').'</li>';
          }
          if(!empty($teacherinfo->email)){
          $tchtxt.='<li class="list-group-item"><label class="profiletitle">E-MAIL</label>'.($teacherinfo->email??'--').'</li>';
          }
          if(!empty($teacherinfo->mobile)){
          $tchtxt.='<li class="list-group-item"><label class="profiletitle">MOBILE</label>'.($teacherinfo->mobile??'--').'</li>';
          }
          if(!empty($teacherinfo->teachermore->whatsapp)){
          $tchtxt.='<li class="list-group-item"><label class="profiletitle">WHATSAPP</label>'.($teacherinfo->teachermore->whatsapp??'--').'</li>';
           }
          if(!empty($teacherinfo->teachermore->address)){
           $tchtxt.='<li class="list-group-item"><label class="profiletitle">ADDRESS</label>'.($teacherinfo->teachermore->address??'--').'</li>';
          } 
          if(!empty($teacherinfo->teachermore->qualification)){
            $tchtxt.='<li class="list-group-item"><label class="profiletitle">qualification</label>'.(Common::tmodeName($teacherinfo->teachermore->qualification)??'--').'</li>';
           } 
           if(!empty($teacherinfo->teachermore->subjects)){
            $tchtxt.='<li class="list-group-item"><label class="profiletitle">subjects</label><a class="subjecttxt">'.(Common::getSubjects($teacherinfo->teachermore->subjects)??'--').'</a></li>';
           } 
           if(!empty($teacherinfo->teachermore->timings)){
            $tchtxt.='<li class="list-group-item"><label class="profiletitle">timings</label>'.($teacherinfo->teachermore->timings??'--').'</li>';
           } 
           if(!empty($teacherinfo->teachermore->experience)){
            $tchtxt.='<li class="list-group-item"><label class="profiletitle">experience</label>'.($teacherinfo->teachermore->experience??'--').' Years</li>';
           } 
           if(!empty($teacherinfo->teachermore->description)){
            $tchtxt.='<li class="list-group-item"><label class="profiletitle">description</label>'.($teacherinfo->teachermore->description??'--').'</li>';
           } 

          $tchtxt.='</ul>';
        }
        return ['status'=>200,'message'=>$tchtxt];
        }

        public function getTeamTeacherDetailsAjax($id){ 
            $tchtxt='';
            $teacherinfo = User::with('teachermore')->where('id',$id)->first();  
            if(!empty($teacherinfo->id)){
              $tchtxt.='<ul class="list-group">';  
              $profileimg = ''; 
              $tchtxt.='<li class="list-group-item text-center "><img style="border-radius:5px;" src="'.Common::profileimage($teacherinfo->image).' " height="200"></li>';
              if(!empty($teacherinfo->name)){
              $tchtxt.='<li class="list-group-item"><label class="profiletitle">NAME</label>'.($teacherinfo->name??'--').'</li>';
              }
              if(!empty($teacherinfo->email)){
              $tchtxt.='<li class="list-group-item"><label class="profiletitle">E-MAIL</label>'.($teacherinfo->email??'--').'</li>';
              }
              if(!empty($teacherinfo->mobile)){
              $tchtxt.='<li class="list-group-item"><label class="profiletitle">MOBILE</label>'.($teacherinfo->mobile??'--').'</li>';
              }
              if(!empty($teacherinfo->teachermore->whatsapp)){
              $tchtxt.='<li class="list-group-item"><label class="profiletitle">WHATSAPP</label>'.($teacherinfo->teachermore->whatsapp??'--').'</li>';
               }
              if(!empty($teacherinfo->teachermore->address)){
               $tchtxt.='<li class="list-group-item"><label class="profiletitle">ADDRESS</label>'.($teacherinfo->teachermore->address??'--').'</li>';
              } 
              if(!empty($teacherinfo->teachermore->qualification)){
                $tchtxt.='<li class="list-group-item"><label class="profiletitle">qualification</label>'.(Common::tmodeName($teacherinfo->teachermore->qualification)??'--').'</li>';
               } 
               if(!empty($teacherinfo->teachermore->subjects)){
                $tchtxt.='<li class="list-group-item"><label class="profiletitle">subjects</label><a class="subjecttxt">'.(Common::getSubjects($teacherinfo->teachermore->subjects)??'--').'</a></li>';
               } 
               if(!empty($teacherinfo->teachermore->timings)){
                $tchtxt.='<li class="list-group-item"><label class="profiletitle">timings</label>'.($teacherinfo->teachermore->timings??'--').'</li>';
               } 
               if(!empty($teacherinfo->teachermore->experience)){
                $tchtxt.='<li class="list-group-item"><label class="profiletitle">experience</label>'.($teacherinfo->teachermore->experience??'--').' Years</li>';
               } 
               if(!empty($teacherinfo->teachermore->description)){
                $tchtxt.='<li class="list-group-item"><label class="profiletitle">description</label>'.($teacherinfo->teachermore->description??'--').'</li>';
               } 

              $tchtxt.='</ul>';
            }
            return ['status'=>200,'message'=>$tchtxt];
            }

        //get course video link
        public function getCourseVideoAjax($courseid){
            $tchtxt='';
            $course_details = Course::with('teacher','faq','feedback')->where('id',$courseid)->first();

            if(!empty($course_details->id)){
               if(!empty($teacherinfo->teachermore->description)){
                $tchtxt.='<iframe src="'.$course_details->youtube_url.'"></iframe>';
               } 
            }
            return ['status'=>200,'message'=>$tchtxt];
            }


        public function postTeacherReviews(Request $request){
            if(empty($request->id)){
                return ['status'=>400,'message'=>'Invalid request'];
            }
            if(empty($request->teacher_rating)){
                return ['status'=>400,'message'=>'Please choose the rating'];
            }
            if(empty($request->teacher_review)){
                return ['status'=>400,'message'=>'Please write your feedback'];
            }
            if(empty(Auth::user()->id)){
                return ['status'=>400,'message'=>'Please login to access this'];
            }

            $review = TeacherReview::where('student_id',Auth::user()->id)->where('teacher_id',$request->id)->first();
            if(empty($review->id)){
            $reviewx = new TeacherReview;
            $reviewx->student_id = Auth::user()->id??0; 
            $reviewx->teacher_id = $request->id;
            $reviewx->teacher_rating = $request->teacher_rating??0;
            $reviewx->teacher_review = $request->teacher_review??'';
            $reviewx->save();
            return ['status'=>200,'message'=>'Your review is posted successfully. Thank you'];
            }else{
            return ['status'=>400,'message'=>'You have already posted your feedback. Thank you'];    
            }
        }
        public function index(){
            try {
                $pageData = SinglePage::where('id',5)->first();
                $popularCategories = Common::homecoursecategory();
                $courses = Course::with('category')->where('is_active',1)->latest('id')->take(6)->get();
                $blogs = Common::blogs();
                $teachers = Common::teachers();
                $stats = [
                    'courses' => Common::coursecount(),
                    'teachers' => Common::teacherscount(),
                    'students' => User::where('type','student')->count(),
                ];
                $states = CustomData::where('key_name','state')->where('parent_id',0)->orderBy('name','asc')->get();
                $subjects = CustomData::where('key_name','subject')->orderBy('name','asc')->get();
                $boards = CustomData::where('key_name','board')->orderBy('name','asc')->get();
            } catch (\Throwable $e) {
                if (!file_exists(storage_path('installed'))) {
                    return redirect()->route('install.index');
                }
                throw $e;
            }

            return Inertia::render('Front/Home', compact(
                'pageData', 'popularCategories', 'courses', 'blogs', 'teachers', 'stats', 'states', 'subjects', 'boards'
            ));
        }

        public function changepassword(){
            return Inertia::render('Dashboard/ChangePassword');
        }

        public function forgotpassword(){
            return Inertia::render('Auth/ForgotPassword');
        }

        public function register(){ 
            return Inertia::render('Auth/Register');
        }

        public function addteacher(){
            return Inertia::render('Front/AddTeacher');
        }

        public function all_course(){
            $courses = Course::with('category')->where('is_active',1)->latest('id')->paginate(12);
            $categories = CourseCategory::where('is_active',1)->orderBy('title','asc')->get();
            return Inertia::render('Front/AllCourse', compact('courses', 'categories')); 
        }

        public function blog_details(Request $request, $blogid){
            $bloglist = Blog::orderBy('id','desc')->where('is_active',1)->take(5)->get();
            $blogdetails = Blog::where('id',$blogid)->where('is_active',1)->first();
            $feedbacklist = BlogFeedback::with('user')->where('blog_id',$blogid)->where('is_active',1)->orderBy('id','desc')->get();
            return Inertia::render('Front/BlogDetails',compact('bloglist','blogdetails','feedbacklist'));
        }

        //course feedback
        public function blog_feedback(Request $request)
        {
          
            $validator = Validator::make($request->all(), [
                'rating' => 'required',
                'blogfeedback' => 'required',
                'blog_id' => 'required'
                ]
            );
            if($validator->fails()) {
                return ["status"=>400,"message"=>$validator->errors()->first()];
            }

            if(empty(Auth::user()->id)){
                return ["status"=>400,"message"=>"Please login to access this feature."];
            }
            if(!empty($request->blog_id)){
            $blogfeedback = new BlogFeedback;
            $blogfeedback->blog_id       = $request->blog_id??0;
            $blogfeedback->user_id       = Auth::user()->id??0;
            $blogfeedback->rating        = !empty($request->rating)?$request->rating:0;
            $blogfeedback->blogfeedback  =!empty($request->blogfeedback)?$request->blogfeedback:'';
            $blogfeedback->is_active     =!empty($request->is_active)?$request->is_active:0;
            $blogfeedback->save();
            return ["status"=>200,"message"=>"Your feedback has been posted."];
            }
            return ["status"=>400,"message"=>"Invalid Request"];
        }

        public function blog(){
            return redirect('/blogs');
        }

        public function blog_list(){
            $bloglist = Blog::orderBy('id','desc')->where('is_active',1)->paginate(12);
            return Inertia::render('Front/Blogs', compact('bloglist')); 
        }

        public function cart(){
            return redirect('/all_course');
        }

        public function checkout(){
            return redirect('/all_course');
        } 

        public function course_details(Request $request, $courseid){
            $course_details = Course::with('teacher.user','faq','feedback.user')->where('id',$courseid)->first();
            $coursecategories = CourseCategory::withcount('courses')->where('is_active',1)->orderBy('title','asc')->get();
            $feedbacklist = CourseFeedback::with('user')->where('course_id',$courseid)->where('is_active',1)->orderBy('id','desc')->get();
            return Inertia::render('Front/CourseDetails', compact('course_details','coursecategories','feedbacklist'));
        }

        public function course_list(Request $request,$catid){ 
            $coursecategory = CourseCategory::where('id',$catid)->first();
            $courselist = Course::with('teacher.user')->where('category_id',$catid)->paginate(30);
            return Inertia::render('Front/CourseList', compact('courselist','coursecategory'));
        }

        //save courses (fav course)
        public function addmyfavcourse(Request $request){
        
            if(empty(Auth::user()->id)){
                return ["status"=>400,"message"=>"Please login to access this feature."];
            }
            if(!empty($request->id)){
                $myfavcourse = CourseFavourite::where('course_id',$request->id)->where('user_id',Auth::user()->id)->first();
                if(!empty($myfavcourse->id)){
                $myfavcourse->forceDelete();
                return ["status"=>200,"message"=>"Removed from Favourites"]; 
                }else{
                $myfavcourse = new CourseFavourite;
                $myfavcourse->course_id = $request->id??0;
                $myfavcourse->user_id   = Auth::user()->id??0;
                $myfavcourse->save();
                return ["status"=>200,"message"=>"Saved to Favourites"];
                }
            }
            
        return ["status"=>400,"message"=>"Invalid Request!"];
        }

        public function myfavouritecourses(){
            $myfavcourselist = CourseFavourite::with('course.category','user')->where('user_id',Auth::user()->id)->paginate(30);
            return Inertia::render('Dashboard/FavouriteCourses',compact('myfavcourselist'));
        }

        public function mycourses(){
            $mycourselist = enrollCourse::with('course.category','user')->where('user_id',Auth::user()->id)->where(function($sq){
                $sq->where('status','accepted')->orwhere('status','completed');
                })->paginate(12);
            return Inertia::render('Dashboard/MyCourses',compact('mycourselist'));
        } 

        //enroll course
        public function enrollcourse(Request $request){
        
            if(empty(Auth::user()->id)){
                return ["status"=>400,"message"=>"Please login to access this feature."];
            }
            if(!empty($request->id)){
                $enrollcourse = enrollCourse::where('course_id',$request->id)
                ->where('user_id',Auth::user()->id)
                ->where(function($sq){
                $sq->where('status','accepted')->orwhere('status','pending')->orwhere('status','completed');
                })->first();
                if(!empty($enrollcourse->id)){
                 return ["status"=>400,"message"=>"You have already enrolled  this course!"];   
                }
                $enrollcoursex = new enrollCourse;
                $enrollcoursex->course_id = $request->id??0;
                $enrollcoursex->user_id   = Auth::user()->id??0; 
                $enrollcoursex->status    = 'pending'; 
                $enrollcoursex->save();
                return ["status"=>200,"message"=>"You have successfully enrolled to this course!"];
            }
            
        return ["status"=>400,"message"=>"Invalid Request!"]; 
        }
        //course feedback
        public function course_feedback(Request $request){
          
            $validator = Validator::make($request->all(), [
                'rating' => 'required',
                'feedback' => 'required',
                'course_id' => 'required'
                ]
            );
            if($validator->fails()) {
                return ["status"=>400,"message"=>$validator->errors()->first()];
            }

            if(empty(Auth::user()->id)){
                return ["status"=>400,"message"=>"Please login to access this feature."];
            }
            if(!empty($request->course_id)){
            $coursefeedback = new CourseFeedback;
            $coursefeedback->course_id = $request->course_id??0;
            $coursefeedback->user_id   = Auth::user()->id??0;
            $coursefeedback->rating    = !empty($request->rating)?$request->rating:0;
            $coursefeedback->feedback  =!empty($request->feedback)?$request->feedback:'';
            $coursefeedback->is_active =!empty($request->is_active)?$request->is_active:0;
            $coursefeedback->save();
            return ["status"=>200,"message"=>"Your feedback has been posted."];
        }
        return ["status"=>400,"message"=>"Invalid Request"];
    }

        public function event_details(){
            return redirect()->route('front.all_course');
        }
        public function event_sidebar(){
            return redirect()->route('front.all_course');
        }
        public function event(){
            return redirect()->route('front.all_course');
        }
        public function faq(){
            $faqlist = Faq::where('is_active',1)->get();
            return Inertia::render('Front/Faq',compact('faqlist'));
        }
        public function gallery(){
            $gallerylist = Common::gallery();
            return Inertia::render('Front/Gallery',compact('gallerylist'));
        }
        public function login(){
            return Inertia::render('Auth/Login');
        }
        public function otp(){
            return Inertia::render('Auth/Register');
        }
        public function setting(){
            return redirect()->route('front.dashboard.index');
        }
        public function shop_dtails(){
            return redirect()->route('front.all_course');
        }
        public function shop(){
            return redirect()->route('front.all_course');
        }
        
        public function studentinterface(){
            return redirect()->route('front.dashboard.index');
        }
        public function search(Request $request){
            $radius = !empty($request->search_radius) ? (float)$request->search_radius : 0;
            $userLat = $request->user_lat ?? $request->latitude ?? Session::get('latitude');
            $userLng = $request->user_lng ?? $request->longitude ?? Session::get('longitude');

            if (!empty($userLat) && !empty($userLng)) {
                Session::put('latitude', (string)$userLat);
                Session::put('longitude', (string)$userLng);
            }

            $lists = User::select(
                'users.*',
                'teachers.id as tid',
                'teachers.qualification',
                'teachers.gender',
                'teachers.description',
                'teachers.state',
                'teachers.district',
                'teachers.city',
                'teachers.board',
                'teachers.subjects',
                'teachers.latitude',
                'teachers.longitude')
                ->join('teachers','users.id','=','teachers.user_id')
                ->where('is_active',1);

            if(!empty($request->search_state)){
                $lists = $lists->where('teachers.state',$request->search_state);
            }
            if(!empty($request->search_district)){
                $lists = $lists->where('teachers.district',$request->search_district);
            }
            if(!empty($request->search_city)){
                $lists = $lists->where('teachers.city',$request->search_city);
            }
            if(!empty($request->search_board)){
                $board = $request->search_board;
                $lists = $lists->whereRaw('FIND_IN_SET("'.$board.'",teachers.board)');                   
            }
            if(!empty($request->search_subject)){
                $subject = $request->search_subject;
                $lists = $lists->whereRaw('FIND_IN_SET("'.$subject.'",teachers.subjects)');                   
            }
            if(!empty($request->search_gender)){
                $lists = $lists->where('teachers.gender',$request->search_gender);
            }
            
            if(!empty($userLat) && !empty($userLng)){
                $haversine = "( 6371 * acos(
                    least(1.0, greatest(-1.0,
                        cos( radians(?) ) *
                        cos( radians( CAST(teachers.latitude AS DECIMAL(10,6)) ) ) *
                        cos( radians( CAST(teachers.longitude AS DECIMAL(10,6)) ) - radians(?) ) +
                        sin( radians(?) ) *
                        sin( radians( CAST(teachers.latitude AS DECIMAL(10,6)) ) )
                    ))
                ) )";
                $lists = $lists->selectRaw("$haversine AS distance", [(float)$userLat, (float)$userLng, (float)$userLat]);

                if($radius > 0){
                    $lists = $lists->whereNotNull('teachers.latitude')
                                   ->where('teachers.latitude', '!=', '')
                                   ->whereNotNull('teachers.longitude')
                                   ->where('teachers.longitude', '!=', '')
                                   ->having("distance", "<=", $radius)
                                   ->orderBy('distance', 'asc');
                }
            }

            $lists = $lists->paginate(20)->withQueryString();
            if(!empty(Auth::user()->id)){
                $check = Search::where('user_id',Auth::user()->id)->whereDate('created_at',date('Y-m-d'));
                if(!empty($request->lookingfor)){
                    $check  = $check->where('lookingfor',$request->lookingfor);
                }
                if(!empty($request->search_state)){
                    $check  = $check->where('state',$request->search_state);
                }
                if(!empty($request->search_district)){
                    $check  = $check->where('district',$request->search_district);
                }
                if(!empty($request->search_city)){
                    $check  = $check->where('city',$request->search_city);
                }
                if(!empty($request->search_board)){
                    $check  = $check->where('board',$request->search_board);
                }
                if(!empty($request->search_subject)){
                    $check  = $check->where('subject',$request->search_subject);
                }
                if(!empty($request->search_gender)){
                    $check  = $check->where('gender',$request->search_gender);
                }
                if(!empty($request->search_radius)){
                    $check  = $check->where('radius',$request->search_radius);
                } 
                $check  = $check->first();
                if(empty($check->id)){
                    $savesearch = new Search;
                    $savesearch->user_id = Auth::user()->id;
                    $savesearch->lookingfor = $request->lookingfor;
                    $savesearch->state = $request->search_state;
                    $savesearch->district = $request->search_district;
                    $savesearch->city = $request->search_city;
                    $savesearch->board = $request->search_board;
                    $savesearch->subject = $request->search_subject;
                    $savesearch->gender = $request->search_gender;
                    $savesearch->radius = $request->search_radius;
                    $savesearch->save(); 
                }
            }
            $lists = $this->enrichTeacherLists($lists);
            $custom_lookups = CustomData::pluck('name', 'id')->toArray();
            $searchdetails = [
                'lookingfor' => $request->lookingfor ?? 'teacher',
                'search_state' => $request->search_state ?? '0',
                'search_district' => $request->search_district ?? '0',
                'search_city' => $request->search_city ?? '0',
                'search_board' => $request->search_board ?? '0',
                'search_subject' => $request->search_subject ?? '0',
                'search_gender' => $request->search_gender ?? '',
                'search_radius' => $radius,
                'user_lat' => $userLat,
                'user_lng' => $userLng,
            ];
            return Inertia::render('Front/SearchResults', compact('lists', 'custom_lookups', 'searchdetails'));
        }

        public function showsearchresult(Request $request, $id){
            $searchdetails = Search::find($id);
            if (!$searchdetails) {
                return redirect()->route('front.search');
            }
            $radius = !empty($searchdetails->radius) ? (float)$searchdetails->radius : 0;
            $userLat = $request->user_lat ?? $request->latitude ?? Session::get('latitude');
            $userLng = $request->user_lng ?? $request->longitude ?? Session::get('longitude');

            $lists = User::select(
                'users.*',
                'teachers.id as tid',
                'teachers.qualification',
                'teachers.gender',
                'teachers.description',
                'teachers.state',
                'teachers.district',
                'teachers.city',
                'teachers.board',
                'teachers.subjects',
                'teachers.latitude',
                'teachers.longitude')
                ->join('teachers','users.id','=','teachers.user_id')
                ->where('is_active',1);

            if(!empty($searchdetails->state)){
                $lists = $lists->where('teachers.state',$searchdetails->state);
            }
            if(!empty($searchdetails->district)){
                $lists = $lists->where('teachers.district',$searchdetails->district);
            }
            if(!empty($searchdetails->city)){
                $lists = $lists->where('teachers.city',$searchdetails->city);
            }
            if(!empty($searchdetails->board)){
                $board = $searchdetails->board;
                $lists = $lists->whereRaw('FIND_IN_SET("'.$board.'",teachers.board)');                   
            }
            if(!empty($searchdetails->subject)){
                $subject = $searchdetails->subject;
                $lists = $lists->whereRaw('FIND_IN_SET("'.$subject.'",teachers.subjects)');                   
            }
            if(!empty($searchdetails->gender)){
                $lists = $lists->where('teachers.gender',$searchdetails->gender);
            }
            
            if(!empty($userLat) && !empty($userLng)){
                $haversine = "( 6371 * acos(
                    least(1.0, greatest(-1.0,
                        cos( radians(?) ) *
                        cos( radians( CAST(teachers.latitude AS DECIMAL(10,6)) ) ) *
                        cos( radians( CAST(teachers.longitude AS DECIMAL(10,6)) ) - radians(?) ) +
                        sin( radians(?) ) *
                        sin( radians( CAST(teachers.latitude AS DECIMAL(10,6)) ) )
                    ))
                ) )";
                $lists = $lists->selectRaw("$haversine AS distance", [(float)$userLat, (float)$userLng, (float)$userLat]);

                if($radius > 0){
                    $lists = $lists->whereNotNull('teachers.latitude')
                                   ->where('teachers.latitude', '!=', '')
                                   ->whereNotNull('teachers.longitude')
                                   ->where('teachers.longitude', '!=', '')
                                   ->having("distance", "<=", $radius)
                                   ->orderBy('distance', 'asc');
                }
            }

            $lists = $lists->paginate(20)->withQueryString();
            $lists = $this->enrichTeacherLists($lists);
            $custom_lookups = CustomData::pluck('name', 'id')->toArray();
            return Inertia::render('Front/SearchResults', compact('lists', 'searchdetails', 'custom_lookups'));
        }

        private function enrichTeacherLists($lists)
        {
            $qualIds = [];
            $allSubIds = [];
            $allBoardIds = [];

            foreach ($lists->getCollection() as $item) {
                if (!empty($item->qualification)) {
                    $qualIds = array_merge($qualIds, explode(',', (string)$item->qualification));
                }
                if (!empty($item->subjects)) {
                    $allSubIds = array_merge($allSubIds, explode(',', (string)$item->subjects));
                }
                if (!empty($item->board)) {
                    $allBoardIds = array_merge($allBoardIds, explode(',', (string)$item->board));
                }
            }

            $idsToLookup = array_unique(array_filter(array_map('trim', array_merge($qualIds, $allSubIds, $allBoardIds))));
            $lookup = !empty($idsToLookup)
                ? CustomData::whereIn('id', $idsToLookup)->pluck('name', 'id')->toArray()
                : [];

            $lists->getCollection()->transform(function ($item) use ($lookup) {
                if (!empty($item->qualification)) {
                    $qIds = array_filter(array_map('trim', explode(',', (string)$item->qualification)));
                    $names = array_filter(array_map(fn($id) => $lookup[$id] ?? (is_numeric($id) ? null : $id), $qIds));
                    $item->qualification_name = !empty($names) ? implode(', ', $names) : '';
                } else {
                    $item->qualification_name = '';
                }

                if (!empty($item->subjects)) {
                    $subIds = array_filter(array_map('trim', explode(',', (string)$item->subjects)));
                    $names = array_filter(array_map(fn($id) => $lookup[$id] ?? (is_numeric($id) ? null : $id), $subIds));
                    $item->subject_names = !empty($names) ? implode(', ', $names) : '';
                } else {
                    $item->subject_names = '';
                }

                if (!empty($item->board)) {
                    $boardIds = array_filter(array_map('trim', explode(',', (string)$item->board)));
                    $names = array_filter(array_map(fn($id) => $lookup[$id] ?? (is_numeric($id) ? null : $id), $boardIds));
                    $item->board_names = !empty($names) ? implode(', ', $names) : '';
                } else {
                    $item->board_names = '';
                }

                $item->distance = isset($item->distance) && !is_null($item->distance) ? round((float)$item->distance, 2) : null;

                return $item;
            });

            return $lists;
        }

        public function searchhistory(){
            $searchlist = Search::orderBy('id','desc')->where('user_id',Auth::user()->id);
            $searchlist = $searchlist->paginate(20)->withQueryString();

            return Inertia::render('Dashboard/SearchHistory', compact('searchlist'));
        }

        public function searchdestroy($id)
        {
            $searchlist = Search::findorfail($id);
            $searchlist->forceDelete(); 
            return redirect()->back()->withSuccess('Record deleted successfully.');
             
        } 

        public function team(){
            $teachers = Common::teachers();
            return Inertia::render('Front/Team', compact('teachers'));
        }

        public function contact(){
            return Inertia::render('Front/Contact');
        }

        public function contactpost(Request $request){
            $validator = Validator::make($request->all(), [
                'name' => 'required',
                'email' => 'required',
                'phone' => 'required',
                'message' => 'required',


                ],[
                'name.required' => trans('This field is required!'),
                'email.required' => trans('This field is required!'),
                'phone.required' => trans('This field is required!'),
                'message.required' => trans('This field is required!'),

                ]
            );
            if($validator->fails()) {
                return ['status'=>400,'message'=>$validator->errors()->first()];
            }

            $data = new ContactUs;
            $data->name = !empty($request->name)?$request->name:'';
            $data->email = !empty($request->email)?$request->email:'';
            $data->phone = !empty($request->phone)?$request->phone:'';
            $data->message = !empty($request->message)?$request->message:'';
            $data->is_read = !empty($request->is_read)?$request->is_read:0;
            $data->save();
            return ["status"=>200,"message"=>trans('Message successfully sent!')];
        }

        

       
        public function ourmission(Request $request){        
            $pageData = SinglePage::where('id',1)->first();
            return Inertia::render('Front/OurMission',compact('pageData'));
        }

        public function ourvision(Request $request){        
            $pageData = SinglePage::where('id',2)->first();
            return Inertia::render('Front/OurVision',compact('pageData'));
        }

        public function about(Request $request){        
            $pageData = SinglePage::where('id',3)->first();
            $pageDatax = SinglePage::where('id',4)->first();
            return Inertia::render('Front/About',compact('pageData','pageDatax'));
        }
 
      


        public function getDistrictAjax($id){
            $data = CustomData::where('key_name','state')->where('parent_id',$id)->get();
            return response()->json($data);
        }

        //save lat/long in session
        public function savelatlong($lt,$lg){
        Session::put('latitude',$lt);
        Session::put('longitude',$lg);
        return ["status"=>200,"message"=>'Save '.$lt.'-'.$lg];
        }

        
}
