<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'The Local Tutors') }} - Verified Home & Online Tutors in Kolkata</title>
    <meta name="description" content="Find qualified, background-verified local home tutors and online educators across Kolkata and West Bengal. Specialized 1-on-1 tutoring in TIF Core Mathematics, Science, CBSE, ICSE, WBBSE boards, Artificial Intelligence, and Basic Computer skills.">
    <meta name="keywords" content="The Local Tutors, home tutor kolkata, private tutor salt lake, online tutor behala, math tutor CBSE, ICSE chemistry teacher, WBBSE tuition, TIF core mathematics, AI courses for students, basic computer course">
    <meta name="author" content="The Local Tutors">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="The Local Tutors">
    <meta property="og:title" content="The Local Tutors - Verified Home & Online Educators">
    <meta property="og:description" content="Connect with verified home tutors, private mentors, and coaching institutes across Kolkata. Personalized 1-on-1 and small batch tuition for all school boards.">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:locale" content="en_IN">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="The Local Tutors - Find Qualified Mentors Near You">
    <meta name="twitter:description" content="Verified home & online personal tutors for CBSE, ICSE, WBBSE, Core Mathematics, and Computer Skills.">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="57x57" href="{{ asset('favicon/apple-icon-57x57.png') }}">
    <link rel="apple-touch-icon" sizes="60x60" href="{{ asset('favicon/apple-icon-60x60.png') }}">
    <link rel="apple-touch-icon" sizes="72x72" href="{{ asset('favicon/apple-icon-72x72.png') }}">
    <link rel="apple-touch-icon" sizes="76x76" href="{{ asset('favicon/apple-icon-76x76.png') }}">
    <link rel="apple-touch-icon" sizes="114x114" href="{{ asset('favicon/apple-icon-114x114.png') }}">
    <link rel="apple-touch-icon" sizes="120x120" href="{{ asset('favicon/apple-icon-120x120.png') }}">
    <link rel="apple-touch-icon" sizes="144x144" href="{{ asset('favicon/apple-icon-144x144.png') }}">
    <link rel="apple-touch-icon" sizes="152x152" href="{{ asset('favicon/apple-icon-152x152.png') }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('favicon/apple-icon-180x180.png') }}">
    <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('favicon/android-icon-192x192.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{ asset('favicon/favicon-96x96.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon/favicon-16x16.png') }}">
    <link rel="manifest" href="{{ asset('favicon/manifest.json') }}">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Theme Custom Icons & Styles -->
    <link rel="stylesheet" href="{{ asset('front/css/icomoom.css') }}">
    <link rel="stylesheet" href="{{ asset('front/scss/style.css') }}">

    <!-- Google Maps API Key Config -->
    <script>
        window.GOOGLE_MAPS_API_KEY = @json(env('VITE_GOOGLE_MAPS_API_KEY') ?: env('GOOGLE_MAPS_API_KEY') ?: '');
    </script>

    <!-- Scripts & Styles -->
    @viteReactRefresh
    @vite(['resources/sass/app.scss', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
