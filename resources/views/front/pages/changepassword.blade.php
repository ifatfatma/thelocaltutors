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
                        <h4 class="mb-0">Change Password</h4>
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
                    <h2>Change Password?</h2>
                    
                    <form method="post"  id="contact-form-mejor">
                        <div class="form-floating mb-5" class="col-lg-6">
                            <input type="password" class="form-control" id="name" placeholder="Enter current password">
                            <label class="lable-text" for="name">Current Password*</label>
                            <div class="password-key">
                                <i class="icon-eye"></i>
                            </div>
                        </div>

                        <div class="form-floating mb-5"class="col-lg-6">
                            <input type="password" class="form-control" id="new_password" placeholder="Enter new password">
                            <label class="lable-text" for="new_password">New Password*</label>
                            <div class="password-key">
                                <i class="icon-eye"></i>
                            </div>
                        </div>

                        <div class="form-floating mb-5"class="col-lg-6">
                            <input type="password" class="form-control" id="confirm_password" placeholder="confirm_password">
                            <label class="lable-text" for="confirm_password">Confirm Password</label>
                            <div class="password-key">
                                <i class="icon-eye"></i>
                            </div>
                        </div>

                        <button type="button" class="auth-btn w-100">Update</button>
                    </form> 
                </div>
            </div>
        </div>
    </div>
</div>
    
    <!-- Login & Register Area -->
@endsection