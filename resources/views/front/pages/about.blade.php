@extends('front.layouts.layouts')

@section('content')
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url(img/bg-img/home-3/bg.png);">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="#">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>About Us</li>
                        </ul>
                        <h4 class="mb-0">About Us</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- About us Area -->
    <div class="about-us-area single-page">
        <div class="container">
            <div class="row justify-content-between">
                <!-- title & image -->
                <div class="col-lg-7 mb-5">
                    <div class="">
                        <div class="about-single-1-img">
                            <img src="{{asset('front/img/bg-img/inner/about-1.png')}}" width="500" alt="">
                        </div>                        
                    </div>
                </div>

                <!-- About Text -->
                <div class="col-lg-5">
                    <div class="about-us-title-img">
                        <div class="wow fadeInRight" data-wow-delay="500ms">
                            
                            <h2>{{$pageData->title}}</h2>
                        </div>
                    </div>
                    <div class="about-desc-info-area">
                        <h6 class="mb-4">{!!$pageData->description!!}</h6>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- About us Area -->

    {{--@include('front.pages.home.teacher')--}}

       {{-- @include('front.pages.aboutusmore') --}}

@endsection