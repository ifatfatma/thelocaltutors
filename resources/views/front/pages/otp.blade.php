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
                    <div class="log-area">
                        <h2>OTP Verification</h2>
                        
                                <div class=" p-2 text-center">
                                    <h6>Please enter the one time password <br> to verify your account</h6>
                                    <div> <span>A code has been sent to</span> <small>*******9897</small> </div>
                                    <div id="otp" class="inputs d-flex flex-row justify-content-center mt-2"> <input class="m-2 text-center form-control rounded" type="text" id="first" maxlength="1" /> <input class="m-2 text-center form-control rounded" type="text" id="second" maxlength="1" /> <input class="m-2 text-center form-control rounded" type="text" id="third" maxlength="1" /> <input class="m-2 text-center form-control rounded" type="text" id="fourth" maxlength="1" /> </div>
                                </div>
                            

                        <button type="submit" class="auth-btn w-100 mt-1">Validate</button>
                        <a href="#">Resend OTP</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Login & Register Area -->
@endsection