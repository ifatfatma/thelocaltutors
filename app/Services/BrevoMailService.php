<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

class BrevoMailService
{
    /**
     * Brevo Transactional Email v3 API Endpoint
     */
    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

    /**
     * Send a transactional email using Brevo REST API or Brevo SMTP relay.
     *
     * @param string $toEmail Recipient email address
     * @param string $subject Email subject line
     * @param string $htmlContent HTML body of the email
     * @param string|null $toName Recipient name (optional)
     * @param string|null $fromEmail Sender email address (must be verified in Brevo)
     * @param string|null $fromName Sender display name
     * @return array ['success' => bool, 'provider' => string, 'message_id' => string|null, 'error' => string|null]
     */
    public static function sendTransactionalEmail(
        string $toEmail,
        string $subject,
        string $htmlContent,
        ?string $toName = null,
        ?string $fromEmail = null,
        ?string $fromName = null
    ): array {
        $toEmail = strtolower(trim($toEmail));
        $apiKey = trim(config('services.brevo.key') ?? '');
        $smtpUsername = trim(config('services.brevo.smtp_username') ?? '');
        $smtpPassword = trim(config('services.brevo.smtp_password') ?? $apiKey);

        $fromEmail = trim($fromEmail ?? config('services.brevo.sender_email') ?? config('mail.from.address') ?? 'info@thelocaltutors.com');
        $fromName = trim($fromName ?? config('services.brevo.sender_name') ?? config('mail.from.name') ?? config('app.name', 'The Local Tutors'));
        $toName = trim($toName ?? explode('@', $toEmail)[0]);

        $isSmtpKey = str_starts_with($apiKey, 'xsmtpsib-');

        // 1. If key starts with 'xsmtpsib-', it is a Brevo SMTP Key -> dispatch via Brevo SMTP
        if ($isSmtpKey) {
            if (!empty($smtpUsername)) {
                return self::sendViaBrevoSmtp($toEmail, $toName, $subject, $htmlContent, $fromEmail, $fromName, $smtpUsername, $smtpPassword);
            }

            // Key is an SMTP key, but login username is missing
            $msg = "Detected Brevo SMTP key (starts with 'xsmtpsib-'), but BREVO_SMTP_USERNAME is missing in .env. Please add your Brevo login email in BREVO_SMTP_USERNAME, or generate an API key (starts with 'xkeysib-') in Brevo under SMTP & API > API Keys.";
            Log::warning($msg);

            // Attempt fallback to local/debug if available
            if (config('mail.default') === 'log' || config('app.debug')) {
                Log::info("Email '{$subject}' logged locally for {$toEmail}.");
                return [
                    'success'    => true,
                    'provider'   => 'local_logged',
                    'message_id' => null,
                    'error'      => null,
                    'logged'     => true,
                    'notice'     => $msg,
                ];
            }

            return [
                'success'    => false,
                'provider'   => 'brevo_smtp',
                'message_id' => null,
                'error'      => $msg,
            ];
        }

        // 2. If Brevo REST API Key is configured ('xkeysib-'), use Brevo v3 REST API
        if (!empty($apiKey)) {
            try {
                $payload = [
                    'sender' => [
                        'name'  => $fromName,
                        'email' => $fromEmail,
                    ],
                    'to' => [
                        [
                            'email' => $toEmail,
                            'name'  => $toName,
                        ],
                    ],
                    'subject'     => $subject,
                    'htmlContent' => $htmlContent,
                ];

                $response = Http::timeout(12)
                    ->withHeaders([
                        'api-key'      => $apiKey,
                        'Content-Type' => 'application/json',
                        'Accept'       => 'application/json',
                    ])
                    ->post(self::BREVO_API_URL, $payload);

                if ($response->successful()) {
                    $data = $response->json();
                    $messageId = $data['messageId'] ?? null;

                    Log::info("Brevo API: Email '{$subject}' sent to {$toEmail} | Message ID: {$messageId}");

                    return [
                        'success'    => true,
                        'provider'   => 'brevo_api',
                        'message_id' => $messageId,
                        'error'      => null,
                    ];
                }

                $errorData = $response->json();
                $errorMessage = $errorData['message'] ?? $response->body();
                Log::error("Brevo API Error [HTTP {$response->status()}] sending to {$toEmail}: {$errorMessage}");

                return [
                    'success'    => false,
                    'provider'   => 'brevo_api',
                    'message_id' => null,
                    'error'      => "Brevo Error ({$response->status()}): {$errorMessage}",
                ];
            } catch (\Throwable $e) {
                Log::error("Brevo API Exception sending to {$toEmail}: " . $e->getMessage());

                return [
                    'success'    => false,
                    'provider'   => 'brevo_api',
                    'message_id' => null,
                    'error'      => 'Brevo API connection failure: ' . $e->getMessage(),
                ];
            }
        }

        // 3. Fallback to Laravel Mailer (Brevo SMTP mailer, system SMTP, or log)
        try {
            Mail::html($htmlContent, function ($message) use ($toEmail, $toName, $subject, $fromEmail, $fromName) {
                $message->to($toEmail, $toName)
                        ->from($fromEmail, $fromName)
                        ->subject($subject);
            });

            $defaultMailer = config('mail.default', 'log');
            Log::info("Email '{$subject}' sent to {$toEmail} via Laravel Mailer [{$defaultMailer}].");

            return [
                'success'    => true,
                'provider'   => 'laravel_' . $defaultMailer,
                'message_id' => null,
                'error'      => null,
            ];
        } catch (\Throwable $e) {
            Log::error("Laravel Mailer Exception sending to {$toEmail}: " . $e->getMessage());

            if (config('mail.default') === 'log' || config('app.debug')) {
                return [
                    'success'    => true,
                    'provider'   => 'local_fallback',
                    'message_id' => null,
                    'error'      => null,
                    'logged'     => true,
                ];
            }

            return [
                'success'    => false,
                'provider'   => 'laravel_mailer',
                'message_id' => null,
                'error'      => $e->getMessage(),
            ];
        }
    }

    /**
     * Send email directly through Brevo SMTP Relay (smtp-relay.brevo.com:587)
     */
    public static function sendViaBrevoSmtp(
        string $toEmail,
        string $toName,
        string $subject,
        string $htmlContent,
        string $fromEmail,
        string $fromName,
        string $username,
        string $password
    ): array {
        try {
            $host = config('mail.mailers.brevo.host', 'smtp-relay.brevo.com');
            $port = (int) config('mail.mailers.brevo.port', 587);

            $transport = new EsmtpTransport($host, $port, false);
            $transport->setUsername($username);
            $transport->setPassword($password);

            $mailer = new Mailer($transport);

            $email = (new Email())
                ->from(new Address($fromEmail, $fromName))
                ->to(new Address($toEmail, $toName))
                ->subject($subject)
                ->html($htmlContent);

            $mailer->send($email);

            Log::info("Brevo SMTP: Email '{$subject}' sent successfully to {$toEmail} via {$host}:{$port}.");

            return [
                'success'    => true,
                'provider'   => 'brevo_smtp',
                'message_id' => null,
                'error'      => null,
            ];
        } catch (\Throwable $e) {
            Log::error("Brevo SMTP Relay Error sending to {$toEmail}: " . $e->getMessage());

            return [
                'success'    => false,
                'provider'   => 'brevo_smtp',
                'message_id' => null,
                'error'      => "Brevo SMTP Error: " . $e->getMessage(),
            ];
        }
    }

    /**
     * Check if Brevo is configured (either via REST API Key or Brevo SMTP).
     */
    public static function isConfigured(): bool
    {
        $hasApiKey = !empty(config('services.brevo.key'));
        $hasSmtp = !empty(config('services.brevo.smtp_username')) && !empty(config('services.brevo.smtp_password'));

        return $hasApiKey || $hasSmtp;
    }
}
