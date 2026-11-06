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
        //dd($request);
        $teacherbasic = User::find(Auth::user()->id);
        if(!empty($request->file('image'))){
        $image = Image::read($request->file('image'));

        // Main Image Upload on Folder Code
        $imageName = time().'-'.$request->file('image')->getClientOriginalName();
        $destinationPath = public_path('user/');
        $image->save($destinationPath.$imageName);

        // Generate Thumbnail Image Upload on Folder Code
        $destinationPathThumbnail = public_path('user/thumbnail/');
        $image->resize(100,100);
        $image->save($destinationPathThumbnail.$imageName);
        $teacherbasic->image = $imageName;
        }
        $teacherbasic->name = $request->name??'';
        $teacherbasic->mobile = $request->mobile??'';
        $teacherbasic->email = $request->email??'';
        $teacherbasic->save();

        if($teacherbasic->type=='teacher'){
        $teacher                = Teacher::firstOrNew(array('user_id' =>Auth::user()->id));
        $teacher->gender        = $request->gender??'Male';
        $teacher->user_id       = Auth::user()->id;
        $teacher->description   = $request->description??'';
        $teacher->whatsapp      = $request->whatsapp??'';
        $teacher->experience    = $request->experience??'';
        $teacher->qualification = !empty($request->qualification)?implode(',',$request->qualification):NULL;
        $teacher->teaching_mode = !empty($request->teaching_mode)?implode(',',$request->teaching_mode):NULL;
        $teacher->board         = !empty($request->board)?implode(',',$request->board):NULL;
        $teacher->subjects      = !empty($request->subjects)?implode(',',$request->subjects):NULL;
        $teacher->days          = !empty($request->days)?implode(',',$request->days):NULL;
        $teacher->timings       = $request->timings??'';
        $teacher->street        = $request->street??'';
        $teacher->block         = $request->block??'';
        $teacher->post_office   = $request->post_office??'';
        $teacher->police_station= $request->police_station??'';
        $teacher->address       = $request->address??'';
        $teacher->district      = $request->district??0;
        $teacher->city          = $request->city??0;
        $teacher->state         = $request->state??0;
        $teacher->pincode       = $request->pincode??'';
        $teacher->latitude      = $request->latitude??'';
        $teacher->longitude     = $request->longitude??'';
        $teacher->save();
        }
        return back()->with(["status"=>200,"message"=>"Information Updated Successfully"]);


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
    $data =  CustomData::where('key_name','state')->where('parent_id',$request->state_id)->orderBy('name','asc')->get();
    return response()->json($data);
    }
    //ajax get districts
    public function getCities(Request $request){ Log::info('district = '.$request->district_id);
    $data =  CustomData::where('key_name','state')->where('parent_id',$request->district_id)->orderBy('name','asc')->get();
    return response()->json($data);
    }

    //ajax get user details
    public function getUsersDetails(){
        $data = auth()->user();
        return response()->json($data);
    }
}
