<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustomData;
use App\Models\Teacher;
use App\Models\User;
use Auth;
use Intervention\Image\Laravel\Facades\Image;
use File;
use Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class FrontUserController extends Controller
{
    //edit profile for user
    public function editprofile(){
        
        $userdetails = User::where('id',Auth::user()->id)->first();  
        $teacherdetails = Teacher::where('user_id',Auth::user()->id)->first();
        $states = CustomData::where('key_name','state')->where('parent_id',0)->orderBy('name','asc')->get();
        $boards = CustomData::where('key_name','board')->orderBy('name','asc')->get();
        $subjects = CustomData::where('key_name','subject')->orderBy('name','asc')->get();
        $qualifications = CustomData::where('key_name','qualification')->orderBy('name','asc')->get();
        $modes = CustomData::where('key_name','teachmode')->orderBy('name','asc')->get();
        $days = CustomData::where('key_name','days')->orderBy('name','asc')->get();

        return Inertia::render('Dashboard/EditProfile', compact(
            'userdetails','teacherdetails','states','boards','subjects','qualifications','modes','days'
        ));
    }

    public function EditProfilePost(Request $request)
    {
        $teacherbasic = User::findOrFail(Auth::user()->id);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageName = time() . '-' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $destinationPath = public_path('user/');
            $destinationPathThumbnail = public_path('user/thumbnail/');

            File::ensureDirectoryExists($destinationPath);
            File::ensureDirectoryExists($destinationPathThumbnail);

            try {
                $image = Image::read($file);
                $image->save($destinationPath . $imageName);

                $image->resize(100, 100);
                $image->save($destinationPathThumbnail . $imageName);
            } catch (\Throwable $e) {
                Log::warning('Intervention image processing failed, fallback to direct upload: ' . $e->getMessage());
                $file->move($destinationPath, $imageName);
                if (file_exists($destinationPath . $imageName)) {
                    @copy($destinationPath . $imageName, $destinationPathThumbnail . $imageName);
                }
            }

            $teacherbasic->image = $imageName;
        }

        $teacherbasic->name = $request->name ?? '';
        $teacherbasic->mobile = $request->mobile ?? '';
        $teacherbasic->email = $request->email ?? '';
        $teacherbasic->save();

        if ($teacherbasic->type == 'teacher' || $request->filled('experience') || $request->filled('teaching_mode') || $request->filled('qualification') || Teacher::where('user_id', Auth::user()->id)->exists()) {
            $teacher                = Teacher::firstOrNew(['user_id' => Auth::user()->id]);
            $teacher->gender        = $request->gender ?? 'Male';
            $teacher->user_id       = Auth::user()->id;
            $teacher->description   = \App\Helpers\HtmlSanitizer::clean($request->description);
            $teacher->whatsapp      = $request->whatsapp ?? '';
            $teacher->experience    = $request->experience ?? '';
            $teacher->qualification = !empty($request->qualification) ? (is_array($request->qualification) ? implode(',', $request->qualification) : $request->qualification) : null;
            $teacher->teaching_mode = !empty($request->teaching_mode) ? (is_array($request->teaching_mode) ? implode(',', $request->teaching_mode) : $request->teaching_mode) : null;
            $teacher->board         = !empty($request->board) ? (is_array($request->board) ? implode(',', $request->board) : $request->board) : null;
            $teacher->subjects      = !empty($request->subjects) ? (is_array($request->subjects) ? implode(',', $request->subjects) : $request->subjects) : null;
            $teacher->days          = !empty($request->days) ? (is_array($request->days) ? implode(',', $request->days) : $request->days) : null;
            $teacher->timings       = $request->timings ?? '';
            $teacher->street        = $request->street ?? '';
            $teacher->block         = $request->block ?? '';
            $teacher->post_office   = $request->post_office ?? '';
            $teacher->police_station= $request->police_station ?? '';
            $teacher->address       = $request->address ? trim((string)$request->address) : '';
            $teacher->district      = $request->district ? trim((string)$request->district) : '';
            $teacher->city          = $request->city ? trim((string)$request->city) : '';
            $teacher->state         = $request->state ? trim((string)$request->state) : '';
            $teacher->pincode       = $request->pincode ? trim((string)$request->pincode) : '';

            // Validate & sanitize latitude (-90 to 90) and longitude (-180 to 180)
            $lat = $request->filled('latitude') ? (float)trim((string)$request->latitude) : null;
            $lng = $request->filled('longitude') ? (float)trim((string)$request->longitude) : null;

            if ($lat !== null && $lng !== null && $lat >= -90.0 && $lat <= 90.0 && $lng >= -180.0 && $lng <= 180.0) {
                $teacher->latitude = number_format($lat, 7, '.', '');
                $teacher->longitude = number_format($lng, 7, '.', '');
                Session::put('latitude', $teacher->latitude);
                Session::put('longitude', $teacher->longitude);
            } else {
                $teacher->latitude = null;
                $teacher->longitude = null;
            }

            $teacher->save();

            if ($teacherbasic->type !== 'teacher') {
                $teacherbasic->type = 'teacher';
                $teacherbasic->save();
            }
        }

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'status' => 200,
                'message' => 'Information Updated Successfully',
                'image' => $teacherbasic->image,
                'user' => $teacherbasic
            ]);
        }

        return back()->with(['status' => 200, 'message' => 'Information Updated Successfully']);
    }

     public function EditUserProfilePost(Request $request){
        $edituserprofile = User::findorfail($request->id);
        $edituserprofile->name = $request->name;
        $edituserprofile->email = $request->email;
        $edituserprofile->mobile = $request->mobile;
        $edituserprofile->save();
        return ["status"=>200,"message"=>"Information Updated Successfully"];
    } 

    //ajax get states
    public function getStates(){
    $data = CustomData::where('key_name','state')->where('parent_id',0)->orderBy('name','asc')->get();
    return response()->json($data);
    }
    //ajax get districts
    public function getDistricts(Request $request){ 
        $stateId = $request->state_id ?? $request->id;
        $data = CustomData::where('key_name','state')->where('parent_id', $stateId)->orderBy('name','asc')->get();
        return response()->json($data);
    }
    //ajax get cities
    public function getCities(Request $request){ 
        $districtId = $request->district_id ?? $request->id;
        Log::info('district = ' . $districtId);
        $data = CustomData::where('key_name','state')->where('parent_id', $districtId)->orderBy('name','asc')->get();
        return response()->json($data);
    }

    //ajax get user details
    public function getUsersDetails(){
        $data = auth()->user();
        return response()->json($data);
    }
}
