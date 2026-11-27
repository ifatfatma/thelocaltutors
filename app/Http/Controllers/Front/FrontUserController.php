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
use App\Services\OtpService;

class FrontUserController extends Controller
{
    //edit profile for user
    public function editprofile(){
        
        $userdetails = User::where('id',Auth::user()->id)->first();
        $isTeacher = ($userdetails && strtolower((string)$userdetails->type) === 'teacher');
        $teacherdetails = $isTeacher ? Teacher::where('user_id', Auth::user()->id)->first() : null;
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

    /**
     * Send 6-digit OTP to verify a new Email or Mobile change on Edit Profile.
     */
    public function sendProfileChangeOtp(Request $request)
    {
        $request->validate([
            'type'  => 'required|in:email,mobile',
            'value' => 'required|string|max:192',
        ]);

        $user = User::findOrFail(Auth::id());
        $type = $request->type;
        $value = $type === 'email' ? strtolower(trim($request->value)) : trim($request->value);

        if ($type === 'email') {
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please enter a valid email address.',
                ], 422);
            }
            if ($value === strtolower(trim((string)$user->email))) {
                return response()->json([
                    'success' => false,
                    'message' => 'This is already your current email address.',
                ], 422);
            }
            if (User::where('email', $value)->where('id', '!=', $user->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'This email address is already used by another account.',
                ], 422);
            }

            // Send OTP to the NEW email address to prove ownership
            $result = OtpService::generateAndSendOtp($value, 'verify_email');
            return response()->json($result, $result['status'] ?? 200);
        }

        // Mobile number change
        if (!preg_match('/^[0-9]{10}$/', $value)) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter a valid 10-digit mobile number.',
            ], 422);
        }
        if ($value === trim((string)$user->mobile)) {
            return response()->json([
                'success' => false,
                'message' => 'This is already your current mobile number.',
            ], 422);
        }
        if (User::where('mobile', $value)->where('id', '!=', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This mobile number is already used by another account.',
            ], 422);
        }

        // Send OTP to user's verified email via Brevo to confirm the mobile change
        $targetEmail = strtolower(trim((string)$user->email));
        if (!filter_var($targetEmail, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'success' => false,
                'message' => 'A valid email address on your account is required to receive the verification OTP.',
            ], 422);
        }

        $result = OtpService::generateAndSendOtp($targetEmail, 'verify_mobile', $value);
        if ($result['success'] ?? false) {
            $result['message'] = 'A 6-digit OTP to confirm mobile number ' . $value . ' has been sent to your email (' . OtpService::maskEmail($targetEmail) . ').';
        }

        return response()->json($result, $result['status'] ?? 200);
    }

    /**
     * Verify 6-digit OTP for Email or Mobile change and record session approval.
     */
    public function verifyProfileChangeOtp(Request $request)
    {
        $request->validate([
            'type'  => 'required|in:email,mobile',
            'value' => 'required|string|max:192',
            'otp'   => 'required|string|size:6',
        ]);

        $user = User::findOrFail(Auth::id());
        $type = $request->type;
        $value = $type === 'email' ? strtolower(trim($request->value)) : trim($request->value);
        $otp = trim($request->otp);

        if ($type === 'email') {
            $verify = OtpService::verifyOtp($value, $otp, 'verify_email', true);
            if (!$verify['success']) {
                return response()->json($verify, 422);
            }

            Session::put('verified_profile_email', [
                'user_id'     => $user->id,
                'value'       => $value,
                'verified_at' => now()->timestamp,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'New email address verified! Click "Save Profile" to apply your changes.',
            ]);
        }

        $targetEmail = strtolower(trim((string)$user->email));
        $verify = OtpService::verifyOtp($targetEmail, $otp, 'verify_mobile', true);
        if (!$verify['success']) {
            return response()->json($verify, 422);
        }

        Session::put('verified_profile_mobile', [
            'user_id'     => $user->id,
            'value'       => $value,
            'verified_at' => now()->timestamp,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'New mobile number verified! Click "Save Profile" to apply your changes.',
        ]);
    }

    public function EditProfilePost(Request $request)
    {
        $teacherbasic = User::findOrFail(Auth::user()->id);

        $newEmail = strtolower(trim((string)($request->email ?? $teacherbasic->email)));
        $currentEmail = strtolower(trim((string)$teacherbasic->email));
        $emailChanged = ($newEmail !== $currentEmail);

        $newMobile = trim((string)($request->mobile ?? $teacherbasic->mobile));
        $currentMobile = trim((string)$teacherbasic->mobile);
        $mobileChanged = ($newMobile !== $currentMobile);

        // Enforce OTP verification if Email was changed
        if ($emailChanged) {
            if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
                return response()->json([
                    'status'  => 422,
                    'message' => 'Please enter a valid email address.',
                ], 422);
            }
            if (User::where('email', $newEmail)->where('id', '!=', $teacherbasic->id)->exists()) {
                return response()->json([
                    'status'  => 422,
                    'message' => 'This email address is already registered to another account.',
                ], 422);
            }

            $verifiedEmail = Session::get('verified_profile_email');
            $isEmailVerified = $verifiedEmail
                && ($verifiedEmail['user_id'] ?? null) === $teacherbasic->id
                && ($verifiedEmail['value'] ?? null) === $newEmail
                && (now()->timestamp - ($verifiedEmail['verified_at'] ?? 0)) <= 1800;

            if (!$isEmailVerified) {
                return response()->json([
                    'status'       => 422,
                    'requires_otp' => true,
                    'field'        => 'email',
                    'message'      => 'You changed your email address. Please verify your new email via OTP before saving.',
                ], 422);
            }
        }

        // Enforce OTP verification if Mobile was changed
        if ($mobileChanged) {
            if (!preg_match('/^[0-9]{10}$/', $newMobile)) {
                return response()->json([
                    'status'  => 422,
                    'message' => 'Please enter a valid 10-digit mobile number.',
                ], 422);
            }
            if (User::where('mobile', $newMobile)->where('id', '!=', $teacherbasic->id)->exists()) {
                return response()->json([
                    'status'  => 422,
                    'message' => 'This mobile number is already registered to another account.',
                ], 422);
            }

            $verifiedMobile = Session::get('verified_profile_mobile');
            $isMobileVerified = $verifiedMobile
                && ($verifiedMobile['user_id'] ?? null) === $teacherbasic->id
                && ($verifiedMobile['value'] ?? null) === $newMobile
                && (now()->timestamp - ($verifiedMobile['verified_at'] ?? 0)) <= 1800;

            if (!$isMobileVerified) {
                return response()->json([
                    'status'       => 422,
                    'requires_otp' => true,
                    'field'        => 'mobile',
                    'message'      => 'You changed your mobile number. Please verify your new mobile number via OTP before saving.',
                ], 422);
            }
        }

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);

            $file = $request->file('image');
            $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
            $ext = strtolower($file->guessExtension() ?: $file->getClientOriginalExtension());
            if (!in_array($ext, $allowedExts, true)) {
                return response()->json(['status' => 422, 'message' => 'Invalid image file format.'], 422);
            }

            $imageName = time() . '-' . \Illuminate\Support\Str::random(12) . '.' . $ext;
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
                Log::warning('Intervention image processing failed: ' . $e->getMessage());
                return response()->json(['status' => 422, 'message' => 'Uploaded file could not be processed as a valid image.'], 422);
            }

            $teacherbasic->image = $imageName;
        }

        $teacherbasic->name = $request->name ?? '';
        $teacherbasic->mobile = $newMobile;
        $teacherbasic->email = $newEmail;
        if ($emailChanged) {
            $teacherbasic->username = $newEmail;
            $teacherbasic->email_verified_at = now();
            Session::forget('verified_profile_email');
        }
        if ($mobileChanged) {
            Session::forget('verified_profile_mobile');
        }
        $teacherbasic->save();

        // Strictly update Teacher profile ONLY for accounts with the teacher role (never auto-promote students/admins)
        if (strtolower((string)$teacherbasic->type) === 'teacher') {
            $teacher                = Teacher::firstOrNew(['user_id' => Auth::user()->id]);
            $teacher->name          = $teacherbasic->name;
            $teacher->email         = $teacherbasic->email;
            $teacher->mobile        = $teacherbasic->mobile;
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
        $edituserprofile = Auth::user();
        if (!$edituserprofile) {
            abort(401);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $edituserprofile->name = $validated['name'];
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
