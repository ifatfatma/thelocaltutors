<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\BrevoMailService;

class TestBrevoMailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'brevo:test {email? : The recipient email address for testing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test sending an email OTP via Brevo (API or SMTP)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info("=== Testing Brevo Email OTP Integration ===");

        $apiKey = trim(config('services.brevo.key') ?? '');
        $smtpUsername = trim(config('services.brevo.smtp_username') ?? '');
        $senderEmail = config('services.brevo.sender_email') ?: config('mail.from.address');
        $senderName = config('services.brevo.sender_name') ?: config('mail.from.name');

        $isSmtpKey = str_starts_with($apiKey, 'xsmtpsib-');
        $isApiKey = str_starts_with($apiKey, 'xkeysib-');

        $keyType = 'Not Configured';
        if ($isSmtpKey) {
            $keyType = 'Brevo SMTP Relay Key (xsmtpsib-...)';
        } elseif ($isApiKey) {
            $keyType = 'Brevo REST API Key (xkeysib-...)';
        } elseif (!empty($apiKey)) {
            $keyType = 'Custom Key';
        }

        $this->table(
            ['Setting', 'Configured Value', 'Type / Status'],
            [
                ['BREVO_API_KEY', $apiKey ? substr($apiKey, 0, 12) . '...' . substr($apiKey, -4) : '(Not Set)', $keyType],
                ['BREVO_SMTP_USERNAME', $smtpUsername ?: '(Not Set)', $smtpUsername ? 'OK' : ($isSmtpKey ? 'REQUIRED for SMTP' : 'Optional')],
                ['Sender Email', $senderEmail, $senderEmail ? 'OK' : 'MISSING'],
                ['Sender Name', $senderName, $senderName ? 'OK' : 'DEFAULT'],
            ]
        );

        if ($isSmtpKey && empty($smtpUsername)) {
            $this->warn("\n[NOTICE] Your BREVO_API_KEY is an SMTP key ('xsmtpsib-...').");
            $this->line("To send via Brevo SMTP relay, Brevo requires your SMTP Login email.");
            if ($this->input->isInteractive()) {
                $inputUser = $this->ask("Enter your Brevo Login Email (found in Brevo Dashboard > SMTP & API > SMTP tab)");
                if ($inputUser) {
                    config(['services.brevo.smtp_username' => trim($inputUser)]);
                    $smtpUsername = trim($inputUser);
                }
            }
        }

        $recipient = $this->argument('email');
        if (empty($recipient)) {
            $recipient = $this->ask('Enter recipient email address to send test OTP to');
        }

        $recipient = strtolower(trim($recipient ?? ''));
        if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            $this->error("Invalid email address: '{$recipient}'");
            return self::FAILURE;
        }

        $this->info("\nSending test 6-digit OTP to: {$recipient}...");

        $otp = sprintf('%06d', random_int(100000, 999999));
        $appName = config('app.name', 'The Local Tutors');
        $subject = "Test Verification Code - {$appName}";
        $sentAt = date('Y-m-d H:i:s');

        $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; padding: 25px 15px;">
    <div style="max-width: 520px; margin: auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        <h2 style="color: #0d6efd; margin-top: 0; font-size: 22px;">{$appName} &bull; Brevo Live Test</h2>
        <p style="font-size: 15px; color: #334155;">This is a test OTP verification email sent via <strong>Brevo</strong>.</p>
        <div style="text-align: center; background: #eff6ff; border: 2px dashed #0d6efd; padding: 20px; border-radius: 10px; font-size: 34px; letter-spacing: 8px; font-weight: 800; color: #0d6efd; font-family: 'Courier New', Courier, monospace; margin: 24px 0;">
            {$otp}
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
            Sent at: <strong>{$sentAt}</strong><br>
            If you received this email, your Brevo email OTP service is configured and working perfectly!
        </p>
    </div>
</body>
</html>
HTML;

        $result = BrevoMailService::sendTransactionalEmail(
            toEmail: $recipient,
            subject: $subject,
            htmlContent: $htmlBody,
            toName: 'Test Recipient',
            fromEmail: $senderEmail,
            fromName: $senderName
        );

        if ($result['success']) {
            $this->info("\n [SUCCESS] Email dispatched successfully!");
            $this->line(" Provider:   <fg=green>" . ($result['provider'] ?? 'Unknown') . "</>");
            if (!empty($result['message_id'])) {
                $this->line(" Message ID: <fg=cyan>{$result['message_id']}</>");
            }
            if (!empty($result['logged'])) {
                $this->warn(" Logged: Email was written to local storage/logs/laravel.log.");
            }
            $this->info(" Generated Test OTP: {$otp}");
            return self::SUCCESS;
        }

        $this->error("\n [FAILED] Could not send email via Brevo.");
        $this->line(" Provider: <fg=red>" . ($result['provider'] ?? 'Unknown') . "</>");
        $this->line(" Error:    <fg=red>" . ($result['error'] ?? 'Unknown error') . "</>");

        $this->warn("\nTroubleshooting tips:");
        if ($isSmtpKey) {
            $this->line(" 1. You are using a Brevo SMTP key ('xsmtpsib-...').");
            $this->line("    Add your Brevo Login Email in .env: BREVO_SMTP_USERNAME=your-brevo-email@domain.com");
            $this->line(" 2. Alternatively, to use the REST API (recommended), generate an API Key ('xkeysib-...')");
            $this->line("    in Brevo Dashboard -> SMTP & API -> API Keys, and set BREVO_API_KEY=xkeysib-...");
        } else {
            $this->line(" 1. Make sure your BREVO_API_KEY in .env starts with 'xkeysib-'.");
            $this->line(" 2. In Brevo Dashboard -> Senders & IP, ensure '{$senderEmail}' is a verified sender.");
        }
        $this->line(" 3. Check storage/logs/laravel.log for detailed error logs.");

        return self::FAILURE;
    }
}
