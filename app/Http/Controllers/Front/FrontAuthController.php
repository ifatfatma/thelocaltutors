<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;

use App\Http\Controllers\Common;
use Auth;

use App\Models\User;
class FrontAuthController extends Controller
{
    public function __construct(){
        $this->middleware('guest', ['except' => 'getLogout']);
    }
    //login
    public function LoginPost(LoginRequest $request){
        $remember = ($request->rememberme) ? true : false;

        // attempt to do the login
        $auth = Auth::attempt(
            [
                'mobile'   => $request->user_mobile,
                'password' => $request->user_password  
            ], $remember
        );
        if ($auth) {
            // Save client latitude and longitude if provided in login
            if (!empty($request->latitude) && !empty($request->longitude)) {
                Session::put('latitude', (string)$request->latitude);
                Session::put('longitude', (string)$request->longitude);
                Cookie::queue('user_lat', (string)$request->latitude, 43200);
                Cookie::queue('user_lng', (string)$request->longitude, 43200);
            } else {
                // If logged in as a teacher, retrieve their profile location
                $teacherProfile = \App\Models\Teacher::where('user_id', Auth::id())->first();
                if ($teacherProfile && !empty($teacherProfile->latitude) && !empty($teacherProfile->longitude)) {
                    Session::put('latitude', (string)$teacherProfile->latitude);
                    Session::put('longitude', (string)$teacherProfile->longitude);
                    Cookie::queue('user_lat', (string)$teacherProfile->latitude, 43200);
                    Cookie::queue('user_lng', (string)$teacherProfile->longitude, 43200);
                }
            }

            if($remember){
                $minutes = 10080;
                Cookie::queue('mobile', $request->user_mobile, $minutes);
                Cookie::queue('password', $request->user_password, $minutes);
                Cookie::queue('rememberme', 1, $minutes);
            }

            $user = Auth::user();
            $isAdmin = ($user->type === 'admin' || (method_exists($user, 'hasRole') && ($user->hasRole('Admin') || $user->hasRole('Super Admin'))));
            $redirectUrl = $isAdmin ? '/admin/home' : '/dashboard';

            return response()->json([
                'message' => 'Your login credentials are successfully verified. Please wait while redirecting...',
                'redirect_url' => $redirectUrl,
                'is_admin' => $isAdmin,
            ]);
        } else {
            return response()->json(['message' => 'Invalid login credentials'],400); 
        }
    }
    //register  
    public function RegisterPost(RegisterRequest $request){
        if (!empty($request->latitude) && !empty($request->longitude)) {
            Session::put('latitude', (string)$request->latitude);
            Session::put('longitude', (string)$request->longitude);
            Cookie::queue('user_lat', (string)$request->latitude, 43200);
            Cookie::queue('user_lng', (string)$request->longitude, 43200);
        }

        $user = new User;
        $user->name      = $request->name??'';
        $user->mobile    = $request->mobile??'';
        $user->username  = $request->mobile??'';
        $user->password  = Hash::make($request->password);
        $user->type      = $request->usertype??'';
        $user->is_active = 0;
        $user->save(); 
        $to = $request->mobile;
        $otp = rand(1234,9876);
        Session::put('session_otp',$otp);
        Session::put('session_mobile',$request->mobile);
        Common::sendOTP($to,$otp);
        return response()->json(['message' => 'An OTP has been sent to your registered mobile number('.Common::maskNumber($request->mobile).').Please verify your account.-'.Session::get('session_otp')]);
    }

    public function RegisterPostOtp(Request $request){
        if(!empty($request->first) || !empty($request->second) || !empty($request->third) || !empty($request->fourth)){
        $myotp = $request->first.$request->second.$request->third.$request->fourth;
        if(!empty(Session::get('session_otp')) && Session::get('session_otp')==$myotp){
            $user = User::where('mobile',Session::get('session_mobile'))->first();
            $user->is_active = 1;
            $user->save();
            Session::put('session_otp','');
            return response()->json(['code'=>200,'message' => 'Your account is verified successfully.']);
        }else{
            return response()->json(['code'=>400,'message' => 'Invalid OTP'],422);
        }
        }else{
            return response()->json(['code'=>400,'message' => 'Invalid OTP'],422);
        }
    }
}
