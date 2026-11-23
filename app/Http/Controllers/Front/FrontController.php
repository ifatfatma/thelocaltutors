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
        public function index(Request $request){
            try {
                $pageData = SinglePage::where('id',5)->first();
                $popularCategories = Common::homecoursecategory();
                $courses = Course::with('category')->where('is_active',1)->latest('id')->take(6)->get();
                $blogs = Common::blogs();
                $teachers = Common::teachers();
                $testimonials = TeacherReview::with(['student', 'teacher.user'])->latest('id')->take(6)->get();
                $stats = [
                    'courses' => Common::coursecount(),
                    'teachers' => Common::teacherscount(),
                    'students' => User::where('type','student')->count(),
                ];
                $states = CustomData::where('key_name','state')->where('parent_id',0)->orderBy('name','asc')->get();
                $subjects = CustomData::where('key_name','subject')->orderBy('name','asc')->get();
                $boards = CustomData::where('key_name','board')->orderBy('name','asc')->get();

                $userLat = $request->latitude ?? $request->lat ?? $request->user_lat ?? Session::get('latitude') ?? Cookie::get('user_lat');
                $userLng = $request->longitude ?? $request->lng ?? $request->user_lng ?? Session::get('longitude') ?? Cookie::get('user_lng');

                // If user is authenticated, check their profile coordinates
                if ((empty($userLat) || empty($userLng)) && Auth::check()) {
                    $teacherProfile = Teacher::where('user_id', Auth::id())->first();
                    if ($teacherProfile && !empty($teacherProfile->latitude) && !empty($teacherProfile->longitude)) {
                        $userLat = $teacherProfile->latitude;
                        $userLng = $teacherProfile->longitude;
                    }
                }

                $showcaseData = $this->getShowcaseTeachersData($userLat, $userLng);
                $showcaseTeachers = $showcaseData['teachers'];
                $showcaseNearbyTeachers = $showcaseData['nearby_teachers'];
                $isShowcaseNearby = $showcaseData['is_nearby'];
                $userAreaName = $showcaseData['user_area'] ?? '';
                $showcaseCounts = [
                    'all' => $showcaseData['all_count'],
                    'near_me' => $showcaseData['nearby_count'],
                ];
            } catch (\Throwable $e) {
                if (!file_exists(storage_path('installed'))) {
                    return redirect()->route('install.index');
                }
                throw $e;
            }

            return Inertia::render('Front/Home', compact(
                'pageData', 'popularCategories', 'courses', 'blogs', 'teachers', 'testimonials', 'stats', 'states', 'subjects', 'boards',
                'showcaseTeachers', 'showcaseNearbyTeachers', 'isShowcaseNearby', 'userAreaName', 'showcaseCounts'
            ));
        }

        public function getNearbyShowcaseTeachersAjax(Request $request)
        {
            $lat = $request->lat ?? $request->latitude ?? Session::get('latitude') ?? Cookie::get('user_lat');
            $lng = $request->lng ?? $request->longitude ?? Session::get('longitude') ?? Cookie::get('user_lng');

            if (!empty($lat) && !empty($lng)) {
                Session::put('latitude', (string)$lat);
                Session::put('longitude', (string)$lng);
                Cookie::queue('user_lat', (string)$lat, 43200);
                Cookie::queue('user_lng', (string)$lng, 43200);
            }

            $data = $this->getShowcaseTeachersData($lat, $lng);
            return response()->json([
                'status' => 200,
                'is_nearby' => $data['is_nearby'],
                'teachers' => $data['teachers'],
                'nearby_teachers' => $data['nearby_teachers'],
                'all_count' => $data['all_count'],
                'nearby_count' => $data['nearby_count'],
                'count' => count($data['teachers']),
                'user_lat' => $data['user_lat'],
                'user_lng' => $data['user_lng'],
                'user_area' => $data['user_area'] ?? '',
            ]);
        }

        public function getShowcaseTeachersData($userLat = null, $userLng = null, $radius = null)
        {
            $isNearby = false;
            $userArea = '';

            // 1. Resolve coordinates if missing
            if (empty($userLat) || empty($userLng) || !is_numeric($userLat) || !is_numeric($userLng)) {
                $userLat = Session::get('latitude') ?? Cookie::get('user_lat');
                $userLng = Session::get('longitude') ?? Cookie::get('user_lng');
            }

            // 2. Check logged-in user profile
            if ((empty($userLat) || empty($userLng)) && Auth::check()) {
                $teacherProfile = Teacher::where('user_id', Auth::id())->first();
                if ($teacherProfile && !empty($teacherProfile->latitude) && !empty($teacherProfile->longitude)) {
                    $userLat = $teacherProfile->latitude;
                    $userLng = $teacherProfile->longitude;
                    $userArea = $teacherProfile->address ?: '';
                }
            }

            // 3. Fallback to public IP geolocation if available
            if (empty($userLat) || empty($userLng)) {
                $ip = request()->ip();
                if ($ip && $ip !== '127.0.0.1' && $ip !== '::1' && !str_starts_with($ip, '192.168.') && !str_starts_with($ip, '10.')) {
                    try {
                        $ctx = stream_context_create(['http' => ['timeout' => 1.5]]);
                        $geoJson = @file_get_contents("http://ip-api.com/json/{$ip}?fields=status,city,regionName,lat,lon", false, $ctx);
                        if ($geoJson) {
                            $geo = json_decode($geoJson, true);
                            if (!empty($geo['status']) && $geo['status'] === 'success' && !empty($geo['lat']) && !empty($geo['lon'])) {
                                $userLat = $geo['lat'];
                                $userLng = $geo['lon'];
                                $userArea = $geo['city'] ?? $geo['regionName'] ?? '';
                            }
                        }
                    } catch (\Throwable $e) {}
                }
            }

            // 4. Default regional coordinates: Garden Reach, Kolkata (22.531200, 88.301500)
            // Ensures visitors always see regional proximity sorted tutors immediately
            if (empty($userLat) || empty($userLng)) {
                $userLat = 22.531200;
                $userLng = 88.301500;
                $userArea = 'Garden Reach, Kolkata';
            }

            $haversine = "( 6371 * acos(
                least(1.0, greatest(-1.0,
                    cos( radians(?) ) *
                    cos( radians( CAST(teachers.latitude AS DECIMAL(10,6)) ) ) *
                    cos( radians( CAST(teachers.longitude AS DECIMAL(10,6)) ) - radians(?) ) +
                    sin( radians(?) ) *
                    sin( radians( CAST(teachers.latitude AS DECIMAL(10,6)) ) )
                ))
            ) )";

            $allTeachersCollection = User::select(
                'users.id as user_id',
                'users.name',
                'users.email',
                'users.mobile',
                'users.image',
                'teachers.id as id',
                'teachers.qualification',
                'teachers.gender',
                'teachers.description',
                'teachers.state',
                'teachers.district',
                'teachers.city',
                'teachers.board',
                'teachers.subjects',
                'teachers.experience',
                'teachers.timings',
                'teachers.teaching_mode',
                'teachers.address',
                'teachers.latitude',
                'teachers.longitude'
            )
            ->join('teachers', 'users.id', '=', 'teachers.user_id')
            ->whereIn('users.is_active', ['1', 1])
            ->selectRaw("{$haversine} AS distance", [(float)$userLat, (float)$userLng, (float)$userLat])
            ->orderByRaw('CASE WHEN teachers.latitude IS NOT NULL AND teachers.latitude != "" AND distance IS NOT NULL AND distance <= 50 THEN 0 ELSE 1 END')
            ->orderBy('distance', 'asc')
            ->orderBy('teachers.id', 'desc')
            ->take(16)
            ->get();

            if ($allTeachersCollection->isNotEmpty()) {
                $isNearby = true;
                if (empty($userArea)) {
                    $firstTeacher = $allTeachersCollection->first();
                    $parts = array_map('trim', explode(',', (string)$firstTeacher->address));
                    $userArea = count($parts) > 1 ? $parts[1] : ($parts[0] ?? 'Kolkata');
                }
            }

            // Filter subset of strictly nearby tutors (distance <= 50 km)
            $nearbyTeachersCollection = $allTeachersCollection->filter(function ($t) {
                return !is_null($t->distance) && (float)$t->distance <= 50;
            })->values();

            // If empty, take the closest 4 available
            if ($nearbyTeachersCollection->isEmpty()) {
                $nearbyTeachersCollection = $allTeachersCollection->take(4);
            }

            $formattedAll = $this->formatTeacherCollection($allTeachersCollection, $isNearby);
            $formattedNearby = $this->formatTeacherCollection($nearbyTeachersCollection, true);

            return [
                'teachers' => $formattedAll,
                'nearby_teachers' => $formattedNearby,
                'all_count' => count($formattedAll),
                'nearby_count' => count($formattedNearby),
                'is_nearby' => $isNearby,
                'user_lat' => (float)$userLat,
                'user_lng' => (float)$userLng,
                'user_area' => trim($userArea),
                'count' => count($formattedAll),
            ];
        }

        private function formatTeacherCollection($teachers, $isNearby = false)
        {
            $idsToLookup = [];
            foreach ($teachers as $item) {
                if (!empty($item->qualification)) {
                    $idsToLookup = array_merge($idsToLookup, explode(',', (string)$item->qualification));
                }
                if (!empty($item->subjects)) {
                    $idsToLookup = array_merge($idsToLookup, explode(',', (string)$item->subjects));
                }
                if (!empty($item->board)) {
                    $idsToLookup = array_merge($idsToLookup, explode(',', (string)$item->board));
                }
                if (!empty($item->teaching_mode)) {
                    $idsToLookup = array_merge($idsToLookup, explode(',', (string)$item->teaching_mode));
                }
                if (!empty($item->city)) {
                    $idsToLookup[] = $item->city;
                }
                if (!empty($item->state)) {
                    $idsToLookup[] = $item->state;
                }
            }

            $idsToLookup = array_unique(array_filter(array_map('trim', $idsToLookup)));
            $lookup = !empty($idsToLookup)
                ? CustomData::whereIn('id', $idsToLookup)->pluck('name', 'id')->toArray()
                : [];

            return $teachers->map(function ($item) use ($lookup, $isNearby) {
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
                    $bIds = array_filter(array_map('trim', explode(',', (string)$item->board)));
                    $names = array_filter(array_map(fn($id) => $lookup[$id] ?? (is_numeric($id) ? null : $id), $bIds));
                    $item->board_names = !empty($names) ? implode(', ', $names) : '';
                } else {
                    $item->board_names = '';
                }

                if (!empty($item->teaching_mode)) {
                    $mIds = array_filter(array_map('trim', explode(',', (string)$item->teaching_mode)));
                    $names = array_filter(array_map(fn($id) => $lookup[$id] ?? (is_numeric($id) ? null : $id), $mIds));
                    $item->teaching_mode_name = !empty($names) ? implode(', ', $names) : '';
                } else {
                    $item->teaching_mode_name = '';
                }

                $item->city_name = !empty($item->city) ? ($lookup[$item->city] ?? '') : '';
                $item->state_name = !empty($item->state) ? ($lookup[$item->state] ?? '') : '';
                $item->is_nearby = $isNearby;
                $item->distance = isset($item->distance) && !is_null($item->distance) ? round((float)$item->distance, 2) : null;

                return $item;
            })->values()->toArray();
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
            $course_details = Course::with('teacher','faq','feedback.user')->where('id',$courseid)->first();
            $coursecategories = CourseCategory::withcount('courses')->where('is_active',1)->orderBy('title','asc')->get();
            $feedbacklist = CourseFeedback::with('user')->where('course_id',$courseid)->where('is_active',1)->orderBy('id','desc')->get();
            return Inertia::render('Front/CourseDetails', compact('course_details','coursecategories','feedbacklist'));
        }

        public function course_list(Request $request,$catid){ 
            $coursecategory = CourseCategory::where('id',$catid)->first();
            $courselist = Course::with('teacher')->where('category_id',$catid)->paginate(30);
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
            $filterMode = $request->filter_mode ?? 'all';
            $keyword = trim($request->keyword ?? $request->q ?? $request->search_query ?? '');
            $category = $request->lookingfor ?? $request->category ?? 'teacher';
            $radius = !empty($request->search_radius) ? (float)$request->search_radius : 0;
            $userLat = $request->user_lat ?? $request->latitude ?? Session::get('latitude') ?? Cookie::get('user_lat');
            $userLng = $request->user_lng ?? $request->longitude ?? Session::get('longitude') ?? Cookie::get('user_lng');

            // Fallback default coordinates: Garden Reach, Kolkata (22.531200, 88.301500)
            if (empty($userLat) || empty($userLng)) {
                $userLat = 22.531200;
                $userLng = 88.301500;
            } else {
                Session::put('latitude', (string)$userLat);
                Session::put('longitude', (string)$userLng);
            }

            $area = trim($request->area ?? $request->quick_area ?? '');

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
                'teachers.experience',
                'teachers.teaching_mode',
                'teachers.timings',
                'teachers.address',
                'teachers.latitude',
                'teachers.longitude')
                ->join('teachers','users.id','=','teachers.user_id')
                ->where('is_active',1);

            // Area / Quick Area filter
            if (!empty($area)) {
                $lists = $lists->where('teachers.address', 'LIKE', "%{$area}%");
            }

            // Keyword / Subject / Topic search
            if (!empty($keyword)) {
                $matchingSubjectIds = CustomData::where('key_name', 'subject')
                    ->where('name', 'LIKE', "%{$keyword}%")
                    ->pluck('id')->toArray();
                $matchingBoardIds = CustomData::where('key_name', 'board')
                    ->where('name', 'LIKE', "%{$keyword}%")
                    ->pluck('id')->toArray();

                $lists = $lists->where(function($query) use ($keyword, $matchingSubjectIds, $matchingBoardIds) {
                    $query->where('users.name', 'LIKE', "%{$keyword}%")
                          ->orWhere('teachers.description', 'LIKE', "%{$keyword}%")
                          ->orWhere('teachers.address', 'LIKE', "%{$keyword}%");
                    foreach ($matchingSubjectIds as $subId) {
                        $query->orWhereRaw('FIND_IN_SET(?, teachers.subjects)', [$subId]);
                    }
                    foreach ($matchingBoardIds as $boardId) {
                        $query->orWhereRaw('FIND_IN_SET(?, teachers.board)', [$boardId]);
                    }
                });
            }

            if(!empty($request->search_state) && $request->search_state !== '0'){
                $lists = $lists->where(function($q) use ($request) {
                    $q->where('teachers.state', $request->search_state)
                      ->orWhere('teachers.state', 'LIKE', "%{$request->search_state}%");
                });
            }
            if(!empty($request->search_district) && $request->search_district !== '0'){
                $lists = $lists->where('teachers.district', $request->search_district);
            }
            if(!empty($request->search_city) && $request->search_city !== '0'){
                $lists = $lists->where(function($q) use ($request) {
                    $q->where('teachers.city', $request->search_city)
                      ->orWhere('teachers.city', 'LIKE', "%{$request->search_city}%")
                      ->orWhere('teachers.address', 'LIKE', "%{$request->search_city}%");
                });
            }
            if(!empty($request->search_board) && $request->search_board !== '0'){
                $board = $request->search_board;
                $lists = $lists->whereRaw('FIND_IN_SET("'.$board.'",teachers.board)');                   
            }
            if(!empty($request->search_subject) && $request->search_subject !== '0'){
                $subject = $request->search_subject;
                if (is_numeric($subject)) {
                    $lists = $lists->whereRaw('FIND_IN_SET("'.$subject.'",teachers.subjects)');
                } else {
                    $subId = CustomData::where('key_name', 'subject')->where('name', 'LIKE', "%{$subject}%")->value('id');
                    if ($subId) {
                        $lists = $lists->whereRaw('FIND_IN_SET("'.$subId.'",teachers.subjects)');
                    } else {
                        $lists = $lists->where(function($q) use ($subject) {
                            $q->where('teachers.description', 'LIKE', "%{$subject}%")
                              ->orWhere('users.name', 'LIKE', "%{$subject}%");
                        });
                    }
                }
            }
            if(!empty($request->search_gender)){
                $lists = $lists->where('teachers.gender',$request->search_gender);
            }
            
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

            // Near Me vs. All ordering and filtering logic:
            // "near_me": strictly tutors within 50 km (or requested radius)
            // "all" (Default): all tutors, with Near Me tutors (<= 50km) ordered first, followed by remaining tutors
            if ($filterMode === 'near_me') {
                $maxDist = $radius > 0 ? $radius : 50;
                $lists = $lists->whereNotNull('teachers.latitude')
                               ->where('teachers.latitude', '!=', '')
                               ->whereNotNull('teachers.longitude')
                               ->where('teachers.longitude', '!=', '')
                               ->having("distance", "<=", $maxDist)
                               ->orderBy('distance', 'asc');
            } else {
                if ($radius > 0) {
                    $lists = $lists->whereNotNull('teachers.latitude')
                                   ->where('teachers.latitude', '!=', '')
                                   ->whereNotNull('teachers.longitude')
                                   ->where('teachers.longitude', '!=', '')
                                   ->having("distance", "<=", $radius)
                                   ->orderBy('distance', 'asc');
                } else {
                    // Default load behavior ("All"): Show tutors from "All", ordered so Near Me tutors appear first
                    $lists = $lists->orderByRaw('CASE WHEN teachers.latitude IS NOT NULL AND teachers.latitude != "" AND distance IS NOT NULL AND distance <= 50 THEN 0 ELSE 1 END')
                                   ->orderBy('distance', 'asc')
                                   ->orderBy('teachers.id', 'desc');
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
            $states = CustomData::where('key_name','state')->where('parent_id',0)->orderBy('name','asc')->get();
            $subjects = CustomData::where('key_name','subject')->where('parent_id',0)->orderBy('name','asc')->get();
            $boards = CustomData::where('key_name','board')->where('parent_id',0)->orderBy('name','asc')->get();
            $searchdetails = [
                'lookingfor' => $request->lookingfor ?? 'teacher',
                'search_state' => $request->search_state ?? '0',
                'search_district' => $request->search_district ?? '0',
                'search_city' => $request->search_city ?? '0',
                'search_board' => $request->search_board ?? '0',
                'search_subject' => $request->search_subject ?? '0',
                'search_gender' => $request->search_gender ?? '',
                'search_radius' => $radius,
                'keyword' => $keyword,
                'area' => $area,
                'filter_mode' => $filterMode,
                'user_lat' => $userLat,
                'user_lng' => $userLng,
            ];
            return Inertia::render('Front/SearchResults', compact('lists', 'custom_lookups', 'searchdetails', 'states', 'subjects', 'boards'));
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
            $modeIds = [];

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
                if (!empty($item->teaching_mode)) {
                    $modeIds = array_merge($modeIds, explode(',', (string)$item->teaching_mode));
                }
            }

            $idsToLookup = array_unique(array_filter(array_map('trim', array_merge($qualIds, $allSubIds, $allBoardIds, $modeIds))));
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

                if (!empty($item->teaching_mode)) {
                    $tIds = array_filter(array_map('trim', explode(',', (string)$item->teaching_mode)));
                    $names = array_filter(array_map(fn($id) => $lookup[$id] ?? (is_numeric($id) ? null : $id), $tIds));
                    $item->teaching_mode_name = !empty($names) ? implode(', ', $names) : (is_numeric($item->teaching_mode) ? '' : $item->teaching_mode);
                } else {
                    $item->teaching_mode_name = '';
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
                'name' => 'required|string|max:190',
                'phone' => 'required|string|max:30',
                'email' => 'nullable|email|max:190',
                'message' => 'nullable|string',
            ], [
                'name.required' => trans('Please provide your name.'),
                'phone.required' => trans('Please provide your phone or WhatsApp number.'),
            ]);

            if ($validator->fails()) {
                return ['status' => 400, 'message' => $validator->errors()->first()];
            }

            // Build structured inquiry message if extra fields are passed
            $parts = [];
            if ($request->filled('student_class')) {
                $parts[] = "Class/Level: " . strip_tags($request->student_class);
            }
            if ($request->filled('course_subject')) {
                $parts[] = "Subject/Course: " . strip_tags($request->course_subject);
            }
            if ($request->filled('learning_mode')) {
                $parts[] = "Preferred Mode: " . strip_tags($request->learning_mode);
            }
            if ($request->filled('teacher_name')) {
                $parts[] = "Educator: " . strip_tags($request->teacher_name);
            }
            if ($request->filled('message')) {
                $parts[] = "Notes: " . strip_tags($request->message);
            }

            $formattedMessage = !empty($parts) ? implode("\n", $parts) : ($request->message ?? 'Inquiry via website');

            $data = new ContactUs;
            $data->name = $request->name;
            $data->email = $request->email ?: 'inquiry@thelocaltutors.com';
            $data->phone = $request->phone;
            $data->message = $formattedMessage;
            $data->is_read = 0;
            $data->save();

            return [
                'status' => 200,
                'message' => 'Thank you! Your inquiry has been received. Our coordinator will contact you on WhatsApp / Phone within 2 hours.'
            ];
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

        //save lat/long in session and cookies
        public function savelatlong($lt, $lg){
            Session::put('latitude', (string)$lt);
            Session::put('longitude', (string)$lg);
            \Illuminate\Support\Facades\Cookie::queue('user_lat', (string)$lt, 43200);
            \Illuminate\Support\Facades\Cookie::queue('user_lng', (string)$lg, 43200);
            return response()->json([
                "status" => 200,
                "message" => 'Save '.$lt.'-'.$lg,
                "latitude" => $lt,
                "longitude" => $lg
            ]);
        }

        
}
