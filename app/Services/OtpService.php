<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Services\BrevoMailService;

class OtpService
{
    /**
     * Send a 6-digit OTP code to the given email address.
     *
     * @param string $email
     * @param string $action 'login' | 'reset_password' | 'register' | 'verify_email' | 'verify_mobile'
     * @param string|null $customContext Optional extra context (e.g. new mobile number)
     * @return array
     */
    public static function generateAndSendOtp(string $email, string $action = 'login', ?string $customContext = null): array
    {
        $email = strtolower(trim($email));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false,
                'status'  => 422,
                'message' => 'Please provide a valid email address.',
            ];
        }

        // For login and password reset, ensure account exists
        $user = User::where('email', $email)->first();
        if (!$user && !in_array($action, ['register', 'verify_email', 'verify_mobile'])) {
            return [
                'success' => false,
                'status'  => 404,
                'message' => 'No registered account found with this email address.',
            ];
        }

        if ($user && isset($user->is_active) && (int)$user->is_active === 0 && $action === 'login') {
            return [
                'success' => false,
                'status'  => 403,
                'message' => 'Your account is not verified yet. Please verify your registration via Email OTP first.',
            ];
        }

        // Enforce 60-second resend cooldown
        $recentOtp = DB::table('email_otps')
            ->where('email', $email)
            ->where('action', $action)
            ->where('created_at', '>', Carbon::now()->subSeconds(60))
            ->orderBy('id', 'desc')
            ->first();

        if ($recentOtp) {
            $created = Carbon::parse($recentOtp->created_at);
            $remaining = (int) ceil(60 - $created->diffInSeconds(Carbon::now()));
            if ($remaining > 0) {
                return [
                    'success'   => false,
                    'status'    => 429,
                    'message'   => "Please wait {$remaining} seconds before requesting a new code.",
                    'cooldown'  => $remaining,
                ];
            }
        }

        // Invalidate older unverified OTPs for this email and action
        DB::table('email_otps')
            ->where('email', $email)
            ->where('action', $action)
            ->whereNull('verified_at')
            ->delete();

        // Generate 6-digit cryptographically secure OTP
        $otp = sprintf('%06d', random_int(100000, 999999));
        $expiresAt = Carbon::now()->addMinutes(10);

        // Store OTP in database
        DB::table('email_otps')->insert([
            'email'       => $email,
            'otp'         => $otp,
            'action'      => $action,
            'expires_at'  => $expiresAt,
            'created_at'  => Carbon::now(),
            'updated_at'  => Carbon::now(),
        ]);

        // Build email subject and purpose
        $actionTitle = match ($action) {
            'reset_password' => 'Password Reset Code',
            'register'       => 'Registration Verification Code',
            'verify_email'   => 'Email Change Verification Code',
            'verify_mobile'  => 'Mobile Number Change Verification Code',
            default          => 'Sign-In Verification Code',
        };
        $userName = $user ? ($user->name ?: 'Learner / Educator') : 'Learner / Educator';
        $appName = config('app.name', 'The Local Tutors');

        $htmlBody = self::buildHtmlEmail($userName, $otp, $action, $appName, $customContext);

        // Send via BrevoMailService (bypasses blocked SMTP ports via REST API, with fallback)
        $mailResult = BrevoMailService::sendTransactionalEmail(
            toEmail: $email,
            subject: "{$actionTitle} - {$appName}",
            htmlContent: $htmlBody,
            toName: $userName
        );

        if (!$mailResult['success']) {
            $debugSuffix = config('app.debug') ? " | OTP: {$otp}" : '';
            Log::error("Failed to send OTP email to {$email}: " . ($mailResult['error'] ?? 'Unknown error') . $debugSuffix);

            return [
                'success' => false,
                'status'  => 500,
                'message' => 'Unable to deliver verification email: ' . ($mailResult['error'] ?? 'Please check mail settings.'),
            ];
        }

        $debugSuffix = config('app.debug') ? " Code: {$otp}" : '';
        Log::info("Email OTP successfully sent to {$email} via {$mailResult['provider']} for {$action}.{$debugSuffix}");

        return [
            'success'  => true,
            'status'   => 200,
            'message'  => "A 6-digit verification code has been sent to " . self::maskEmail($email) . " (Valid for 10 minutes).",
            'cooldown' => 60,
            'dev_otp'  => config('app.debug') ? $otp : null,
        ];
    }

    /**
     * Verify a 6-digit OTP code for the given email and action.
     *
     * @param string $email
     * @param string $otp
     * @param string $action 'login' | 'reset_password'
     * @param bool $consume Mark as verified
     * @return array
     */
    public static function verifyOtp(string $email, string $otp, string $action = 'login', bool $consume = true): array
    {
        $email = strtolower(trim($email));
        $otp = trim($otp);

        if (empty($email) || empty($otp)) {
            return [
                'success' => false,
                'message' => 'Email and 6-digit OTP are required.',
            ];
        }

        $record = DB::table('email_otps')
            ->where('email', $email)
            ->where('otp', $otp)
            ->where('action', $action)
            ->whereNull('verified_at')
            ->where('expires_at', '>', Carbon::now())
            ->orderBy('id', 'desc')
            ->first();

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Invalid or expired verification code. Please request a new code.',
            ];
        }

        if ($consume) {
            DB::table('email_otps')
                ->where('id', $record->id)
                ->update([
                    'verified_at' => Carbon::now(),
                    'updated_at'  => Carbon::now(),
                ]);
        }

        return [
            'success' => true,
            'message' => 'Verification code confirmed successfully.',
        ];
    }

    /**
     * Mask email for display in UI messages (e.g. j***n@domain.com).
     */
    public static function maskEmail(string $email): string
    {
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            return $email;
        }

        $name = $parts[0];
        $domain = $parts[1];

        $len = strlen($name);
        if ($len <= 2) {
            $maskedName = substr($name, 0, 1) . '*';
        } else {
            $maskedName = substr($name, 0, 2) . str_repeat('*', max(1, $len - 3)) . substr($name, -1);
        }

        return $maskedName . '@' . $domain;
    }

    /**
     * Build responsive HTML email template for OTP.
     */
    private static function buildHtmlEmail(string $userName, string $otp, string $action, string $appName, ?string $customContext = null): string
    {
        $actionDesc = match ($action) {
            'reset_password' => 'use the verification code below to reset your password',
            'register'       => 'use the verification code below to verify your email and complete your registration',
            'verify_email'   => 'use the verification code below to verify your new email address',
            'verify_mobile'  => 'use the verification code below to confirm updating your mobile number' . ($customContext ? " to <strong>{$customContext}</strong>" : ''),
            default          => 'use the verification code below to sign in to your account',
        };

        $actionNote = match ($action) {
            'reset_password' => 'If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.',
            'register'       => 'If you did not initiate this registration, please disregard this email.',
            'verify_email'   => 'If you did not request this email change, please secure your account immediately.',
            'verify_mobile'  => 'If you did not request this mobile number change, please secure your account immediately.',
            default          => 'If you did not attempt to sign in, please secure your account immediately.',
        };

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$appName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f9; padding: 30px 15px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); padding: 28px 32px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">{$appName}</h1>
                            <p style="margin: 6px 0 0; color: #dbeafe; font-size: 13px;">Secure Account Verification</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px 32px 24px;">
                            <p style="margin: 0 0 16px; font-size: 15px; color: #1f2937; line-height: 1.5;">
                                Hello <strong>{$userName}</strong>,
                            </p>
                            <p style="margin: 0 0 24px; font-size: 14px; color: #4b5563; line-height: 1.6;">
                                Please {$actionDesc}:
                            </p>
                            
                            <!-- OTP Box -->
                            <div style="background-color: #f8fafc; border: 2px dashed #0d6efd; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 24px;">
                                <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0d6efd; font-family: 'Courier New', Courier, monospace;">
                                    {$otp}
                                </div>
                                <div style="font-size: 12px; color: #6b7280; margin-top: 8px; font-weight: 500;">
                                    Valid for 10 minutes &bull; Do not share this code with anyone
                                </div>
                            </div>

                            <p style="margin: 0 0 16px; font-size: 13px; color: #6b7280; line-height: 1.6;">
                                {$actionNote}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                &copy; 2026 {$appName}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }
}
