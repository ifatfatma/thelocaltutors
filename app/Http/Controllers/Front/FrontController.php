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
use App\Models\PlatformFeedback;



use App\Http\Controllers\Common;
use Auth;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Mail;

class FrontController extends Controller
{
    public function getTeacherDetailsAjax($id){
        $teacher = Teacher::with('user')->where('user_id', $id)->orWhere('id', $id)->first();
        $user = User::with('teachermore')->where('id', $id)->first();
        if (!$teacher && $user && $user->teachermore) {
            $teacher = $user->teachermore;
        }

        if (!$teacher && !$user) {
            return response()->json(['status' => 404, 'message' => 'Educator not found']);
        }

        $teacherUser = $teacher->user ?? $user;
        $name = $teacherUser->name ?? ($teacher->name ?? 'Verified Educator');
        $img = Common::profileimage($teacher->image ?: ($teacherUser->image ?? ''));
        $gender = $teacher->gender ?: ($teacherUser->teachermore->gender ?? 'Educator');
        $exp = $teacher->experience ?: ($teacherUser->teachermore->experience ?? '');
        $expText = $exp ? ($exp . ' Yrs Exp') : 'Experienced';

        $city = trim((string)($teacher->city ?? $user->teachermore->city ?? ''));
        $state = trim((string)($teacher->state ?? $user->teachermore->state ?? ''));
        $locParts = [];
        if (!empty($city) && $city !== '0') $locParts[] = $city;
        if (!empty($state) && $state !== '0') $locParts[] = $state;
        $locParts[] = 'India';
        $locationFormatted = implode(', ', $locParts);

        $qualification = $teacher->qualification_name ?: (Common::tmodeName($user->teachermore->qualification ?? 0) ?: 'Graduation');
        $subjects = $teacher->subject_names ?: (Common::getSubjects($user->teachermore->subjects ?? '') ?: 'English, Mathematics');
        $boards = $teacher->board_names ?: 'CBSE, ICSE, WBBSE';
        $teachingMode = $teacher->teaching_mode_name ?: 'Both (Online & Offline)';
        $timings = $teacher->timings ?: ($user->teachermore->timings ?? '10 AM – 10 PM');
        $description = $teacher->description ?: ($user->teachermore->description ?? 'Dedicated and certified educator committed to conceptual clarity, personalized doubt clearing, and continuous academic growth for students.');

        $teacherData = [
            'id' => $teacher->id ?? $user->id,
            'user_id' => $teacher->user_id ?? $user->id,
            'name' => $name,
            'image' => $img,
            'gender' => $gender,
            'experience' => $exp,
            'exp_text' => $expText,
            'city' => $city,
            'state' => $state,
            'country' => 'India',
            'location_formatted' => $locationFormatted,
            'qualification' => $qualification,
            'qualification_name' => $qualification,
            'subjects' => $subjects,
            'subject_names' => $subjects,
            'boards' => $boards,
            'board_names' => $boards,
            'teaching_mode' => $teachingMode,
            'teaching_mode_name' => $teachingMode,
            'timings' => $timings,
            'description' => $description,
            'rating' => 5.0,
            'latitude' => $teacher->latitude ?: ($user->teachermore->latitude ?? null),
            'longitude' => $teacher->longitude ?: ($user->teachermore->longitude ?? null),
        ];

        return response()->json([
            'status' => 200,
            'teacher' => $teacherData,
            'message' => 'OK',
        ]);
    }

    public function getTeamTeacherDetailsAjax($id){ 
        return $this->getTeacherDetailsAjax($id);
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

            // Strictly disable self-reviews: only other users can review another user
            $currentUserId = Auth::id();
            
            // Resolve the target educator's User ID
            $targetTeacher = Teacher::where('id', $request->id)->orWhere('user_id', $request->id)->first();
            $targetUserId = null;
            if ($targetTeacher && !empty($targetTeacher->user_id)) {
                $targetUserId = (int)$targetTeacher->user_id;
            } else {
                $targetUser = User::find($request->id);
                $targetUserId = $targetUser ? (int)$targetUser->id : (int)$request->id;
            }

            // Check if user is attempting to review themselves
            if ($currentUserId === $targetUserId) {
                return ['status' => 400, 'message' => 'Self-reviews are disabled. You cannot review your own educator profile.'];
            }

            $review = TeacherReview::where('student_id', $currentUserId)->where('teacher_id', $targetUserId)->first();
            if(empty($review->id)){
                $reviewx = new TeacherReview;
                $reviewx->student_id = $currentUserId; 
                $reviewx->teacher_id = $targetUserId;
                $reviewx->teacher_rating = $request->teacher_rating??0;
                $reviewx->teacher_review = $request->teacher_review??'';
                if (Schema::hasColumn('teacher_reviews', 'is_active')) {
                    $reviewx->is_active = 0; // Requires administrator approval before public display
                }
                $reviewx->save();
                return ['status'=>200,'message'=>'Thank you! Your review has been submitted and will be displayed once approved by the administrator.'];
            }else{
                return ['status'=>400,'message'=>'You have already submitted a review for this educator.'];    
            }
        }
        public function index(Request $request){
            try {
                $pageData = SinglePage::where('id',5)->first();
                $popularCategories = Common::homecoursecategory();
                $courses = Course::with('category')->where('is_active',1)->latest('id')->take(6)->get();
                $blogs = Common::blogs();
                $teachers = Common::teachers();
                $testimonialsQuery = TeacherReview::with(['student', 'teacher.user']);
                if (Schema::hasColumn('teacher_reviews', 'is_active')) {
                    $testimonialsQuery->where('is_active', 1);
                }
                $testimonials = $testimonialsQuery->latest('id')->take(6)->get();
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
            ->leftJoin('teachers', 'users.id', '=', 'teachers.user_id')
            ->where('users.type', 'teacher')
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
            $courses = Course::with(['category', 'teacher.teachermore'])->where('is_active',1)->latest('id')->paginate(12);
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
            
            if ($course_details) {
                // Ensure Session Duration is properly set and does not show legacy '1' or '1 mins'
                if (empty($course_details->duration) || in_array(trim($course_details->duration), ['1', '1 mins', '1 min', '0'])) {
                    $course_details->duration = ($course_details->id == 2 || str_contains($course_details->name ?? '', 'AI Tools')) ? '40 Hours' : '60 mins / class';
                }

                // If Course 2 / AI Tools course has unformatted description, format and persist clean HTML
                if ($course_details->id == 2 || str_contains($course_details->name ?? '', 'AI Tools')) {
                    if (!str_contains($course_details->description ?? '', '<h4')) {
                        $aiHtml = '<p class="lead text-dark fw-normal mb-3">Discover the power of Artificial Intelligence and learn how to use modern AI tools to make your studies smarter, faster, and more creative. This practical course introduces students to popular AI tools that help with learning, research, assignments, presentations, graphic design, content creation, and productivity.</p>' .
                            '<h4 class="fw-bold text-dark mt-4 mb-3 d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-primary fs-5"></i><span>What You Will Learn</span></h4>' .
                            '<ul class="list-unstyled d-flex flex-column gap-2 mb-3 ps-2">' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span><strong>ChatGPT</strong> – AI-powered learning and smart assistance</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span><strong>Google Gemini</strong> – Research and problem-solving</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span><strong>Microsoft Copilot</strong> – Smart productivity</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span><strong>Canva AI</strong> – Graphic design and presentations</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span><strong>AI Image Generation</strong> – Create images using text prompts</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span><strong>AI for Writing</strong> – Essays, reports, and content creation</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span><strong>AI for Research</strong> – Find, understand, and organize information</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span><strong>Prompt Engineering</strong> – Learn how to communicate effectively with AI</span></li>' .
                            '</ul>' .
                            '<h4 class="fw-bold text-dark mt-4 mb-3 d-flex align-items-center gap-2"><i class="bi bi-people-fill text-primary fs-5"></i><span>Who Can Join?</span></h4>' .
                            '<ul class="list-unstyled d-flex flex-column gap-2 mb-3 ps-2">' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span>School and college students</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span>Graduates and job seekers</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span>Beginners interested in Artificial Intelligence</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span>Anyone who wants to improve digital skills</span></li>' .
                            '</ul>' .
                            '<h4 class="fw-bold text-dark mt-4 mb-3 d-flex align-items-center gap-2"><i class="bi bi-award-fill text-primary fs-5"></i><span>Course Benefits</span></h4>' .
                            '<ul class="list-unstyled d-flex flex-column gap-2 mb-3 ps-2">' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span>Practical hands-on training</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span>Real-world AI applications</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span>Improve creativity and productivity</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span>Learn responsible and ethical AI usage</span></li>' .
                            '<li class="d-flex align-items-start gap-2"><i class="bi bi-arrow-right-short text-primary fs-5 mt-n1 flex-shrink-0"></i><span>Certificate of Completion</span></li>' .
                            '</ul>';
                        $course_details->description = $aiHtml;

                        try {
                            \Illuminate\Support\Facades\DB::table('courses')
                                ->where('id', $course_details->id)
                                ->update([
                                    'description' => $aiHtml,
                                    'duration' => $course_details->duration ?: '40 Hours',
                                    'curriculum' => null,
                                    'target_level' => $course_details->target_level ?: 'Students, Beginners & Professionals',
                                    'educator_status' => $course_details->educator_status ?: 'Verified Educator',
                                    'teaching_mode' => $course_details->teaching_mode ?: 'Online, Private',
                                ]);
                        } catch (\Throwable $e) {}
                    }
                }
            }

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
                return ["status"=>401,"message"=>"Please log in to your student account to enroll in this course."];
            }

            if(empty($request->id)){
                return ["status"=>400,"message"=>"Invalid course request!"]; 
            }

            $course = Course::find($request->id);
            if(!$course){
                return ["status"=>404,"message"=>"Course not found!"];
            }

            $student = Auth::user();

            $existing = enrollCourse::where('course_id', $course->id)
                ->where('user_id', $student->id)
                ->where(function($sq){
                    $sq->where('status', 'accepted')
                       ->orWhere('status', 'pending')
                       ->orWhere('status', 'completed');
                })->first();

            if(!empty($existing->id)){
                return ["status"=>200, "message"=>"You are already enrolled in this course! The educator has your contact details."];   
            }

            $enrollcoursex = new enrollCourse;
            $enrollcoursex->course_id = $course->id;
            $enrollcoursex->user_id   = $student->id; 
            $enrollcoursex->status    = 'pending'; 
            $enrollcoursex->save();

            // Resolve teacher user account to send email notification
            $teacherUser = User::find($course->teacher_id);
            if (!$teacherUser) {
                $teacherProfile = Teacher::find($course->teacher_id);
                if ($teacherProfile && $teacherProfile->user_id) {
                    $teacherUser = User::find($teacherProfile->user_id);
                }
            }

            // Send Email Notification to the Teacher who listed the course
            if ($teacherUser && !empty($teacherUser->email)) {
                try {
                    $teacherName = $teacherUser->name ?: 'Educator';
                    $studentName = $student->name ?: 'A Student';
                    $studentEmail = $student->email ?: 'N/A';
                    $studentPhone = $student->mobile ?: 'N/A';
                    $courseName = $course->name;
                    $priceLabel = !empty($course->price) ? '₹' . number_format($course->price, 2) . ($course->price_type === 'per_month' ? ' / month' : ' (One-Time)') : 'Free';
                    $dateStr = now()->timezone('Asia/Kolkata')->format('d M Y, h:i A');

                    $htmlContent = "
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;'>
                        <div style='text-align: center; margin-bottom: 20px;'>
                            <h2 style='color: #0284c7; margin: 0; font-size: 24px;'>New Student Enrolled!</h2>
                            <p style='color: #64748b; font-size: 14px; margin-top: 5px;'>The Local Tutors - Course Notification</p>
                        </div>
                        <p style='color: #334155; font-size: 16px;'>Hello <strong>" . htmlspecialchars($teacherName) . "</strong>,</p>
                        <p style='color: #334155; font-size: 15px; line-height: 1.5;'>
                            Great news! A new student has just enrolled in your course: <strong style='color: #0284c7;'>" . htmlspecialchars($courseName) . "</strong>.
                        </p>
                        
                        <div style='background-color: #f0f7ff; border-left: 4px solid #0284c7; border-radius: 6px; padding: 16px; margin: 20px 0;'>
                            <h4 style='margin: 0 0 10px 0; color: #0f172a; font-size: 16px;'>Student Details:</h4>
                            <p style='margin: 6px 0; color: #334155;'><strong>Name:</strong> " . htmlspecialchars($studentName) . "</p>
                            <p style='margin: 6px 0; color: #334155;'><strong>Email:</strong> <a href='mailto:" . htmlspecialchars($studentEmail) . "' style='color: #0284c7; text-decoration: none;'>" . htmlspecialchars($studentEmail) . "</a></p>
                            <p style='margin: 6px 0; color: #334155;'><strong>Phone / WhatsApp:</strong> <a href='tel:" . htmlspecialchars($studentPhone) . "' style='color: #0284c7; text-decoration: none;'>" . htmlspecialchars($studentPhone) . "</a></p>
                            <p style='margin: 6px 0; color: #334155;'><strong>Course Fee:</strong> " . htmlspecialchars($priceLabel) . "</p>
                            <p style='margin: 6px 0; color: #334155;'><strong>Enrollment Time:</strong> " . htmlspecialchars($dateStr) . "</p>
                        </div>

                        <p style='color: #334155; font-size: 14px; line-height: 1.5;'>
                            Please log in to your <strong>Educator Dashboard</strong> to view this enrollment and get in touch with your new student.
                        </p>

                        <div style='text-align: center; margin: 25px 0;'>
                            <a href='" . url('/dashboard/courses') . "' style='background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 14px; display: inline-block;'>
                                View Enrolled Students
                            </a>
                        </div>

                        <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;'>
                        <p style='color: #94a3b8; font-size: 12px; text-align: center; margin: 0;'>
                            The Local Tutors &bull; Kolkata & West Bengal<br>
                            <a href='" . url('/') . "' style='color: #0284c7; text-decoration: none;'>thelocaltutors.com</a>
                        </p>
                    </div>";

                    Mail::html($htmlContent, function ($message) use ($teacherUser, $courseName) {
                        $message->to($teacherUser->email, $teacherUser->name)
                                ->subject("New Student Enrolled in your Course: {$courseName} - The Local Tutors");
                    });
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning("Enrollment email notification error: " . $e->getMessage());
                }
            }

            $teacherDisplayName = $teacherUser ? $teacherUser->name : 'the course educator';
            return [
                "status" => 200,
                "message" => "You have successfully enrolled! {$teacherDisplayName} has been notified via email and will get in touch with you shortly."
            ];
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
            $coursefeedback->is_active = 0; // Requires administrator approval
            $coursefeedback->save();
            return ["status"=>200,"message"=>"Thank you! Your course feedback has been submitted successfully and will be displayed after administrator approval."];
        }
        return ["status"=>400,"message"=>"Invalid Request"];
    }

    /**
     * Submit General Website / Platform Feedback (Students, Parents, Teachers)
     */
    public function postPlatformFeedback(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'feedback' => 'required|string|min:5|max:2000',
            'rating' => 'nullable|integer|min:1|max:5',
            'role' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'name' => 'nullable|string|max:191',
            'email' => 'nullable|email|max:191',
        ], [
            'feedback.required' => 'Please share your feedback or experience message.',
            'feedback.min' => 'Feedback message should be at least 5 characters.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => $validator->errors()->first(),
            ]);
        }

        $userId = Auth::id();
        $userName = $request->name ?: (Auth::user() ? Auth::user()->name : 'Anonymous');
        $userEmail = $request->email ?: (Auth::user() ? Auth::user()->email : null);
        $userRole = $request->role ?: (Auth::user() ? (Auth::user()->type === 'teacher' ? 'Teacher' : 'Student') : 'Visitor');

        $feedback = new PlatformFeedback();
        $feedback->user_id = $userId;
        $feedback->name = $userName;
        $feedback->email = $userEmail;
        $feedback->phone = $request->phone ?? (Auth::user() ? Auth::user()->mobile : null);
        $feedback->role = $userRole;
        $feedback->category = $request->category ?: 'Platform Experience';
        $feedback->rating = (int)($request->rating ?: 5);
        $feedback->feedback = trim($request->feedback);
        $feedback->is_active = 0; // Requires admin approval to display publicly
        $feedback->save();

        return response()->json([
            'status' => 200,
            'message' => 'Thank you! Your feedback has been received and will be displayed publicly once approved by the administrator.',
        ]);
    }

    /**
     * Admin: List Platform Feedback Queue
     */
    public function adminPlatformFeedback(Request $request)
    {
        $query = PlatformFeedback::with('user')->latest('id');

        if ($request->has('status') && $request->status !== 'all' && $request->status !== '') {
            $query->where('is_active', $request->status === 'approved' ? 1 : 0);
        }

        $feedbacks = $query->paginate(50)->withQueryString();

        $stats = [
            'total' => PlatformFeedback::count(),
            'pending' => PlatformFeedback::where('is_active', 0)->count(),
            'approved' => PlatformFeedback::where('is_active', 1)->count(),
        ];

        return Inertia::render('Admin/Feedback/PlatformFeedback', [
            'feedbacks' => $feedbacks,
            'stats' => $stats,
            'currentStatus' => $request->status ?? 'all',
        ]);
    }

    /**
     * Admin: Approve Platform Feedback
     */
    public function acceptPlatformFeedback($id)
    {
        $feedback = PlatformFeedback::findOrFail($id);
        $feedback->is_active = 1;
        $feedback->save();
        return redirect()->back()->withSuccess('Platform feedback approved successfully! It will now be visible publicly.');
    }

    /**
     * Admin: Delete Platform Feedback
     */
    public function destroyPlatformFeedback($id)
    {
        $feedback = PlatformFeedback::findOrFail($id);
        $feedback->delete();
        return redirect()->back()->withSuccess('Platform feedback deleted successfully.');
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
                ->leftJoin('teachers','users.id','=','teachers.user_id')
                ->where('users.type', 'teacher')
                ->whereIn('users.is_active', ['1', 1]);

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
                ->leftJoin('teachers','users.id','=','teachers.user_id')
                ->where('users.type', 'teacher')
                ->whereIn('users.is_active', ['1', 1]);

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

        public function team(Request $request){
            $allTeachers = Common::teachers();
            $subjectParam = $request->get('subject');

            $selectedSubject = null;
            $allSubjects = CustomData::where('key_name', 'subject')
                ->where('is_active', '1')
                ->orderBy('name', 'asc')
                ->get(['id', 'name']);

            if (!empty($subjectParam)) {
                $selectedSubject = CustomData::where('key_name', 'subject')
                    ->where(function ($q) use ($subjectParam) {
                        if (is_numeric($subjectParam)) {
                            $q->where('id', $subjectParam);
                        } else {
                            $q->where('name', 'like', $subjectParam)
                              ->orWhereRaw("LOWER(REPLACE(name, ' ', '-')) = ?", [strtolower($subjectParam)]);
                        }
                    })
                    ->first();
            }

            if ($selectedSubject) {
                $subId = (string)$selectedSubject->id;
                $subNameLower = strtolower(trim($selectedSubject->name));

                $teachers = $allTeachers->filter(function ($t) use ($subId, $subNameLower) {
                    $rawSubjects = (string)($t->subjects ?? '');
                    if (!empty($rawSubjects)) {
                        $parts = array_filter(array_map('trim', explode(',', $rawSubjects)));
                        foreach ($parts as $part) {
                            if ($part === $subId || strtolower($part) === $subNameLower) {
                                return true;
                            }
                        }
                    }

                    $subjectNames = strtolower((string)($t->subject_names ?? ''));
                    return str_contains($subjectNames, $subNameLower);
                })->values();
            } else {
                $teachers = $allTeachers;
            }

            return Inertia::render('Front/Team', [
                'teachers' => $teachers,
                'selectedSubject' => $selectedSubject ? [
                    'id' => $selectedSubject->id,
                    'name' => $selectedSubject->name,
                ] : null,
                'allSubjects' => $allSubjects,
            ]);
        }

        public function subjects(){
            $subjects = CustomData::where('key_name', 'subject')
                ->where('is_active', '1')
                ->orderBy('name', 'asc')
                ->get();

            $teachers = Teacher::with('user')
                ->whereHas('user', function ($q) {
                    $q->whereNull('deleted_at');
                })
                ->get();

            // MULTIPLE SUBJECTS RULE:
            // If a teacher teaches multiple subjects (e.g., "13,14" for English & Math),
            // they are counted individually in each of those subjects (+1 English, +1 Math).
            $subjectCards = $subjects->map(function ($s) use ($teachers) {
                $subId = (string)$s->id;
                $subNameLower = strtolower(trim($s->name));

                $count = $teachers->filter(function ($t) use ($subId, $subNameLower) {
                    $rawSubjects = (string)($t->subjects ?? '');
                    if (!empty($rawSubjects)) {
                        $parts = array_filter(array_map('trim', explode(',', $rawSubjects)));
                        foreach ($parts as $part) {
                            if ($part === $subId || strtolower($part) === $subNameLower) {
                                return true;
                            }
                        }
                    }

                    $subjectNames = strtolower((string)($t->subject_names ?? ''));
                    return !empty($subjectNames) && str_contains($subjectNames, $subNameLower);
                })->count();

                $icon = match ($subNameLower) {
                    'math', 'mathematics' => 'bi-calculator-fill',
                    'physics' => 'bi-lightning-charge-fill',
                    'chemistry' => 'bi-droplet-fill',
                    'biology' => 'bi-heart-pulse-fill',
                    'english' => 'bi-book-half',
                    'hindi' => 'bi-translate',
                    'social studies', 'history', 'geography' => 'bi-globe-americas',
                    'computer', 'computer science' => 'bi-laptop-fill',
                    default => 'bi-journal-bookmark-fill',
                };

                $badgeColor = match ($subNameLower) {
                    'math', 'mathematics' => '#0284c7',
                    'physics' => '#d97706',
                    'chemistry' => '#059669',
                    'biology' => '#dc2626',
                    'english' => '#7c3aed',
                    'hindi' => '#ea580c',
                    'social studies' => '#0891b2',
                    default => '#2563eb',
                };

                $description = match ($subNameLower) {
                    'math', 'mathematics' => 'Algebra, Geometry, Calculus, Trigonometry, and board exam numericals with step-by-step problem solving.',
                    'physics' => 'Mechanics, Electromagnetism, Optics, formula mastery, and concept-based numerical preparation.',
                    'chemistry' => 'Organic reaction mechanisms, Inorganic periodic trends, equations, and Physical Chemistry formulas.',
                    'biology' => 'Botany, Zoology, Genetics, human physiology diagrams, and foundation preparation for NEET.',
                    'english' => 'Comprehensive grammar, creative writing, prose, poetry analysis, and spoken English fluency.',
                    'hindi' => 'Vyakaran, Sahitya, Kavita vishleshan, and scoring structured answer presentation for exams.',
                    'social studies' => 'History timeline mastery, Civics, Geography map pointing, and structured school board exam answers.',
                    'computer', 'computer science' => 'Coding foundations, Python, Java, computer applications, and basic AI research tools.',
                    default => 'Personalized 1-on-1 tutoring, doubt resolution, previous years questions, and regular mock assessments.',
                };

                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'slug' => Str::slug($s->name),
                    'teacher_count' => $count,
                    'icon' => $icon,
                    'badge_color' => $badgeColor,
                    'description' => $description,
                    'grades' => 'Class 1 – 12 & Competitive',
                    'boards' => 'CBSE, ICSE, WBBSE',
                ];
            });

            return Inertia::render('Front/Subjects', [
                'subjects' => $subjectCards,
                'totalTeachers' => $teachers->count(),
            ]);
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
