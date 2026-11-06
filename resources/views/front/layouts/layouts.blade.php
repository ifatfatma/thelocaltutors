
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="SupportHive">

    <!-- Title -->
    <title>@yield('title')</title>
    @include('front.partials.css')
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/sass/app.scss', 'resources/js/app.js']) 
</head>

<body >
    <!-- Preloader -->
    @include('front.partials.preloader')
    @include('front.partials.header')

    <div id="smooth-body">
        <div id="smooth-content" >
                <div id="app">
                  @yield('content')
                </div>               
              @include('front.partials.footer')
        </div>
    </div>

   @include('front.partials.js')

</body>

</html>