@extends('front.layouts.layouts')

@section('content')

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="SupportHive">

    <!-- Title -->
    <title>Edumastery - Education & Online Courses HTML Theme</title>

    <!-- Favicon -->
    <link rel="icon" href="img/core-img/favicon.png">

    <!-- Stylesheet -->
    <link rel="stylesheet" href="{{asset('front/css/bootstrap.min.css')}}">
    <link rel="stylesheet" href="{{asset('front/css/animate.css')}}">
    <link rel="stylesheet" href="{{asset('front/css/nice-select2.css')}}">
    <link rel="stylesheet" href="{{asset('front/css/icomoom.css')}}">
    <link rel="stylesheet" href="{{asset('front/css/owl.carousel.min.css')}}">
    <link rel="stylesheet" href="{{asset('front/css/swiper.min.css')}}">
    <link rel="stylesheet" href="{{asset('front/scss/style.css')}}">

</head>

<body>
    <!-- Preloader -->
    <div id="preloader-active">
        <div class="preloader d-flex align-items-center justify-content-center">
            <div class="preloader-inner position-relative">
                <div class="preloader-circle"></div>
                <div class="preloader-img pere-text">
                    <img src="img/core-img/favicon.png" alt>
                </div>
            </div>
        </div>
    </div>

    <!-- Top Header -->
    <div class="top-header four">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="top-header-4-content d-flex align-items-center justify-content-between">
                        <div class="header-4-dropdown d-flex align-items-center">
                            <div class="top-dropdown">
                                <button type="button" class="dropdown-toggle" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <i class="icon-mail"></i> <span class="d-sm-inline-block lan-btn"> E-Mail <i
                                            class="icon-down-arrow-1"></i></span>
                                </button>

                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">{{Iak::setting()->email}}</a></li>
                                </ul>
                            </div>
                        </div>
                       
                        <div class="cart-login--area-4 d-flex align-items-center">
                            
                                    <div class="top-dropdown">
                                        <button type="button" class="dropdown-toggle" data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            <i class="icon-user-tie-solid-1"></i> <span class="d-sm-inline-block lan-btn"><i
                                                    class="icon-down-arrow-1"></i></span>
                                        </button>
        
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="{{url('changepassword')}}">Change password</a></li>
                                            <li><a class="dropdown-item" href="{{url('editprofile')}}">Edit Profile</a></li>
                                            <li><a class="dropdown-item" href="{{url('setting')}}">Setting</a></li>
                                            <li><a class="dropdown-item" href="#">Logout</a></li>

                                        </ul>
                                    </div>
                           
                        </div>
                    </div>

                </div>


            </div>
        </div>
    </div>

    <!-- Header -->
    <header class="header-area four" id="header">
        <nav class="navbar navbar-expand-lg">
            <div class="container">
                <!-- Navbar Brand -->
                <a class="navbar-brand" href="{{url('index')}}">
                    <img src="img/core-img/main_logo.png" alt="Brand" style="height:200px !important;">
                </a>
                <!-- Navbar Toggler -->
                <button class="navbar-toggler" id="navbarToggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="icon-menu"></span>
                </button>


                <!-- Navbar -->
                <div class="collapse navbar-collapse" id="navbarContent">
                    <ul class="navbar-nav navbar-nav-scroll mb-3 mb-lg-0" id="SupportHiveNav">
                        <li >
                            <a href="{{url('index')}}">Home</a>
                            
                        </li>
                        <li class="dropdown-list">
                            <a href="#">Course</a>
                            <ul>
                                <li><a href="{{url('course_list')}}">Course 1</a></li>
                                <li><a href="{{url('course_list')}}">Course 2</a></li>
                                <li><a href="{{url('course-list')}}">Course 3</a></li>
                            </ul>
                        </li>

                        <li>
                            <a href="{{url('about')}}">About Us</a>
                        </li>
                        <li>
                            <a href="{{url('contact')}}">Contact us</a>
                        </li>
                        <li>
                            <a href="{{url('ourmission')}}">Our Mission</a>
                        </li>
                        <li>
                            <a href="{{url('ourvision')}}">Our Vision</a>
                        </li>
                    </ul>

                    <div class="contact-info- ml-auto">
                        <a class="login-btn" href="{{url('register')}}">Join Now</a>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <div id="smooth-body">
        <div id="smooth-content">

            @include('front.partials.home.searcharea')

            @include('front.partials.home.popularcategories')

            @include('front.partials.home.aboutarea')

           @include('front.partials.home.partnerarea')

            @include('front.partials.home.coursecat2')

            @include('front.partials.home.textslider')

           @include('front.partials.home.counterarea')

            @include('front.partials.home.favcourse')

            @include('front.partials.home.joinastutor')

           @include('front.partials.home.teamarea')

            @include('front.partials.home.ourclient')

            @include('front.partials.home.learnskill')

            <!-- Counter up area -->
            <!-- <div class="counter-up-area bg-img padding-140-0" style="background-image: url(img/bg-img/c-bg.png);">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-8 col-lg-7">
                            <div class="section-title-area text-center wow fadeInRight" data-wow-delay="500ms">
                                <h6>Book Your Seat Now</h6>
                                <h2 class="mb-0">Upcoming study trip</h2>
                            </div>
                        </div>
                    </div>
                    <div class="row">

                        <div class="col-sm-6 col-lg-3">
                            <div class="single-counter-card wow fadeInRight" data-wow-delay="500ms">
                                <div class="counter-info text-center bg--primary">
                                    <h2>450</h2>
                                    <p>days</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6 col-lg-3">
                            <div class="single-counter-card wow fadeInRight" data-wow-delay="700ms">
                                <div class="counter-info text-center bg--second">
                                    <h2>10</h2>
                                    <p>Hours</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6 col-lg-3">
                            <div class="single-counter-card wow fadeInRight" data-wow-delay="900ms">
                                <div class="counter-info text-center bg--dark">
                                    <h2>50</h2>
                                    <p>Minutes</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3">
                            <div class="single-counter-card wow fadeInRight" data-wow-delay="1100ms">
                                <div class="counter-info text-center bg--navy">
                                    <h2>55</h2>
                                    <p>Second</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
            <!-- Counter up area -->

           @include('front.partials.footer')
        </div>
    </div>

    <div id="scrollToTop"><i class="icon-right-arrow-11"></i></div>

    <!-- All JavaScript Files -->
    <script src="{{asset('js/jquery.min.js')}}"></script>
    <script src="{{asset('js/bootstrap.bundle.min.js')}}"></script>
    <script src="{{asset('js/gsap/gsap.js')}}"></script>
    <script src="{{asset('js/gsap/gsap-scroll-to-plugin.js')}}"></script>
    <script src="{{asset('js/gsap/gsap-scroll-smooter.js')}}"></script>
    <script src="{{asset('js/gsap/gsap-scroll-trigger.js')}}"></script>
    <script src="{{asset('js/waypoints.min.js')}}"></script>
    <script src="{{asset('js/owl.carousel.min.js')}}"></script>
    <script src="{{asset('js/slidetoggle.min.js')}}"></script>
    <script src="{{asset('js/nice-select2.js')}}"></script>
    <script src="{{asset('js/swiper.min.js')}}"></script>
    <script src="{{asset('js/counter-up.js')}}"></script>
    <script src="{{asset('js/wow.js')}}"></script>
    <script src="{{asset('js/custom.js')}}"></script>
    <script src="{{asset('js/active.js')}}"></script>

</body>

</html>
@endsection