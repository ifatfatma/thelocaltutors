@extends('front.layouts.layouts')

@section('content')
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url(img/bg-img/home-3/bg.png);">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="{{url('index')}}">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>My Account</li>
                        </ul>
                        <h4 class="mb-0">My Account</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Login & Register Area -->
    <div class="log-regi-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <user-login />
                </div>

                
            </div>
        </div>
    </div>
    <!-- Login & Register Area -->
@endsection