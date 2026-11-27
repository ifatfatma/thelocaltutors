<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Services\OtpService;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Auth;

class FrontAuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'getLogout']);
    }

    /**
     * Standard password login (supports email or mobile number).
     */
    public function LoginPost(LoginRequest $request)
    {
        $remember = (bool)$request->rememberme;
        $loginInput = trim($request->user_mobile);
        $field = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'mobile';

        // Check user active / verified status first
        $userCheck = User::where($field, $loginInput)->first();
        if ($userCheck && isset($userCheck->is_active) && (int)$userCheck->is_active === 0) {
            return response()->json([
                'message' => 'Your account is not verified yet. Please verify your registration via Email OTP before signing in.',
            ], 403);
        }

        // Attempt login
        $auth = Auth::attempt([
            $field     => $loginInput,
            'password' => $request->user_password,
        ], $remember);

        if ($auth) {
            $this->handlePostLoginLocation($request);

            if ($remember) {
                $minutes = 10080;
                Cookie::queue('mobile', $loginInput, $minutes);
                Cookie::queue('rememberme', 1, $minutes);
            }

            $user = Auth::user();
            $isAdmin = ($user->type === 'admin' || (method_exists($user, 'hasRole') && ($user->hasRole('Admin') || $user->hasRole('Super Admin'))));
            $redirectUrl = $isAdmin ? '/admin/home' : '/dashboard';

            return response()->json([
                'success'      => true,
                'message'      => 'Your login credentials are successfully verified. Please wait while redirecting...',
                'redirect_url' => $redirectUrl,
                'is_admin'     => $isAdmin,
            ]);
        }

        return response()->json([
            'message' => 'Invalid email/mobile or password. Please check your credentials.',
        ], 400);
    }

    /**
     * Register a new user (Student or Educator).
     * Forces Email OTP verification before the user can log in.
     */
    public function RegisterPost(RegisterRequest $request)
    {
        if (!empty($request->latitude) && !empty($request->longitude)) {
            Session::put('latitude', (string)$request->latitude);
            Session::put('longitude', (string)$request->longitude);
            Cookie::queue('user_lat', (string)$request->latitude, 43200);
            Cookie::queue('user_lng', (string)$request->longitude, 43200);
        }

        $email = strtolower(trim($request->email));
        $mobile = trim($request->mobile);

        $user = new User();
        $user->name              = trim($request->name);
        $user->email             = $email;
        $user->mobile            = $mobile;
        $user->username          = $email;
        $user->password          = Hash::make($request->password);
        $user->type              = $request->usertype;
        $user->is_active         = 0; // Inactive until Email OTP is verified
        $user->email_verified_at = null;
        $user->save();

        // Create teacher profile if educator
        if ($user->type === 'teacher') {
            Teacher::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'name'      => $user->name,
                    'email'     => $user->email,
                    'mobile'    => $user->mobile,
                    'latitude'  => $request->latitude ?? null,
                    'longitude' => $request->longitude ?? null,
                    'status'    => 'active',
                ]
            );
        }

        // Force Email OTP verification via Brevo
        $otpResult = OtpService::generateAndSendOtp($user->email, 'register');

        if (!($otpResult['success'] ?? false)) {
            // Roll back unverified account so user can retry cleanly once email succeeds
            if ($user->type === 'teacher') {
                Teacher::where('user_id', $user->id)->delete();
            }
            $user->delete();

            return response()->json([
                'success' => false,
                'message' => $otpResult['message'] ?? 'Unable to send verification OTP email. Please try again.',
            ], $otpResult['status'] ?? 500);
        }

        Session::put('pending_register_email', $user->email);

        return response()->json([
            'success'      => true,
            'otp_sent'     => true,
            'email'        => $user->email,
            'masked_email' => OtpService::maskEmail($user->email),
            'cooldown'     => $otpResult['cooldown'] ?? 60,
            'message'      => $otpResult['message'] ?? ('A 6-digit verification code has been sent to ' . OtpService::maskEmail($user->email) . '. Please verify your email to activate your account.'),
        ]);
    }

    /**
     * Send OTP to email for Login.
     */
    public function SendEmailOtp(Request $request)
    {
        $request->validate([
            'email'  => 'required|email',
            'action' => 'nullable|string|in:login,reset_password',
        ]);

        $action = $request->input('action', 'login');
        $result = OtpService::generateAndSendOtp($request->email, $action);

        return response()->json($result, $result['status'] ?? 200);
    }

    /**
     * Verify Email OTP and log the user in.
     */
    public function VerifyLoginOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|string|size:6',
        ]);

        $email = strtolower(trim($request->email));
        $otp = trim($request->otp);

        $verify = OtpService::verifyOtp($email, $otp, 'login', true);

        if (!$verify['success']) {
            return response()->json($verify, 422);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No registered user found with this email.',
            ], 404);
        }

        if (isset($user->is_active) && (int)$user->is_active === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is currently inactive.',
            ], 403);
        }

        Auth::login($user, (bool)$request->rememberme);
        $this->handlePostLoginLocation($request);

        $isAdmin = ($user->type === 'admin' || (method_exists($user, 'hasRole') && ($user->hasRole('Admin') || $user->hasRole('Super Admin'))));
        $redirectUrl = $isAdmin ? '/admin/home' : '/dashboard';

        return response()->json([
            'success'      => true,
            'message'      => 'Signed in successfully! Redirecting...',
            'redirect_url' => $redirectUrl,
            'is_admin'     => $isAdmin,
        ]);
    }

    /**
     * Send OTP for Forgot Password.
     */
    public function ForgotPasswordSendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $result = OtpService::generateAndSendOtp($request->email, 'reset_password');

        return response()->json($result, $result['status'] ?? 200);
    }

    /**
     * Reset password using verified 6-digit Email OTP.
     */
    public function ResetPasswordWithOtp(Request $request)
    {
        $request->validate([
            'email'                 => 'required|email',
            'otp'                   => 'required|string|size:6',
            'password'              => 'required|min:6|confirmed',
            'password_confirmation' => 'required',
        ]);

        $email = strtolower(trim($request->email));
        $otp = trim($request->otp);

        $verify = OtpService::verifyOtp($email, $otp, 'reset_password', true);

        if (!$verify['success']) {
            return response()->json($verify, 422);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No account found with this email.',
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Your password has been reset successfully. You can now sign in with your new password.',
        ]);
    }

    /**
     * Verify 6-digit Email OTP during registration and activate account.
     * After verification, user can log in to their account.
     */
    public function RegisterPostOtp(Request $request)
    {
        $email = strtolower(trim($request->email ?? Session::get('pending_register_email', '')));
        $otp = trim($request->otp ?? '');

        if (empty($email) || strlen($otp) !== 6) {
            return response()->json([
                'code'    => 422,
                'success' => false,
                'message' => 'Please enter the complete 6-digit verification code sent to your email.',
            ], 422);
        }

        $verify = OtpService::verifyOtp($email, $otp, 'register', true);

        if (!$verify['success']) {
            return response()->json([
                'code'    => 422,
                'success' => false,
                'message' => $verify['message'] ?? 'Invalid or expired verification code. Please try again.',
            ], 422);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'code'    => 404,
                'success' => false,
                'message' => 'Registration account not found. Please register again.',
            ], 404);
        }

        $user->is_active = 1;
        $user->email_verified_at = now();
        $user->save();

        Session::forget('pending_register_email');

        return response()->json([
            'code'         => 200,
            'success'      => true,
            'message'      => 'Email verified successfully! Your account is now active. Redirecting to sign in...',
            'redirect_url' => '/login',
        ]);
    }

    /**
     * Resend 6-digit Email OTP during registration.
     */
    public function ResendRegisterOtp(Request $request)
    {
        $email = strtolower(trim($request->email ?? Session::get('pending_register_email', '')));
        if (empty($email)) {
            return response()->json([
                'success' => false,
                'message' => 'Registration session expired. Please submit the registration form again.',
            ], 400);
        }

        $result = OtpService::generateAndSendOtp($email, 'register');

        return response()->json($result, $result['status'] ?? 200);
    }

    /**
     * Helper to synchronize latitude & longitude on successful login.
     */
    private function handlePostLoginLocation(Request $request): void
    {
        if (!empty($request->latitude) && !empty($request->longitude)) {
            Session::put('latitude', (string)$request->latitude);
            Session::put('longitude', (string)$request->longitude);
            Cookie::queue('user_lat', (string)$request->latitude, 43200);
            Cookie::queue('user_lng', (string)$request->longitude, 43200);
        } else {
            $teacherProfile = Teacher::where('user_id', Auth::id())->first();
            if ($teacherProfile && !empty($teacherProfile->latitude) && !empty($teacherProfile->longitude)) {
                Session::put('latitude', (string)$teacherProfile->latitude);
                Session::put('longitude', (string)$teacherProfile->longitude);
                Cookie::queue('user_lat', (string)$teacherProfile->latitude, 43200);
                Cookie::queue('user_lng', (string)$teacherProfile->longitude, 43200);
            }
        }
    }
}
