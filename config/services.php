<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'brevo' => [
        'key' => env('BREVO_API_KEY', env('BREVO_KEY', env('SENDINBLUE_API_KEY'))),
        'smtp_username' => env('BREVO_SMTP_USERNAME', env('MAIL_USERNAME')),
        'smtp_password' => env('BREVO_SMTP_PASSWORD', env('BREVO_API_KEY', env('MAIL_PASSWORD'))),
        'sender_email' => env('BREVO_SENDER_EMAIL', env('MAIL_FROM_ADDRESS', 'info@thelocaltutors.com')),
        'sender_name' => env('BREVO_SENDER_NAME', env('MAIL_FROM_NAME', 'The Local Tutors')),
    ],

    'teacher_discovery' => [
        'provider'           => env('DISCOVERY_SEARCH_PROVIDER', 'google_cse'),
        'google_cse_api_key' => env('GOOGLE_CSE_API_KEY'),
        'google_cse_cx'      => env('GOOGLE_CSE_CX'),
        'bing_api_key'       => env('BING_SEARCH_API_KEY'),
        'bing_endpoint'      => env('BING_SEARCH_ENDPOINT', 'https://api.bing.microsoft.com/v7.0/search'),
        'serper_api_key'     => env('SERPER_API_KEY'),
    ],

    'google' => [
        'maps_api_key' => env('GOOGLE_MAPS_API_KEY', env('VITE_GOOGLE_MAPS_API_KEY', '')),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
