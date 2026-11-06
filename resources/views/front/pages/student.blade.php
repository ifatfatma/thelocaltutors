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
                            <li>Student Panel</li>
                        </ul>
                        <h4 class="mb-0">Student Sign Up</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <!-- teacher area -->
    
    <div class="log-regi-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <div class="log-area">
                            <h3>Sign Up as a Student</h3>
                            
                            <form method="post"  id="contact-form-mejor">
                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="name" placeholder="Name">
                                    <label class="lable-text" for="name">Name</label>
                                </div>

                                <div class="form-floating mb-5"class="col-lg-6">
                                    <input type="email" class="form-control" id="email"
                                        placeholder="Email">
                                    <label class="lable-text" for="email">Email</label>
                                </div>

                                <div class="form-floating mb-5"class="col-lg-6">
                                    <input type="text" class="form-control" id="contact"
                                        placeholder="contact">
                                    <label class="lable-text" for="contact">Contact</label>
                                </div>
                                
                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="address"
                                        placeholder="address">
                                    <label class="lable-text" for="address">Address</label>
                                </div>
                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="city"
                                        placeholder="city">
                                    <label class="lable-text" for="city">City</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="state"
                                        placeholder="state">
                                    <label class="lable-text" for="address">State</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="pincode"
                                        placeholder="pincode">
                                    <label class="lable-text" for="pincode">Pincode</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="number" class="form-control" id="address"
                                        placeholder="address">
                                    <label class="lable-text" for="address">Latitude</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="number" class="form-control" id="address"
                                        placeholder="address">
                                    <label class="lable-text" for="address">Longitude</label>
                                </div>
                                <div class="form-floating mb-5" class="col-lg-6">
                                    <textarea class="form-control" placeholder="description"
                                        id="description"></textarea>
                                    <label class="lable-text" for="description">Description</label>
                                </div>


                                <button type="submit" class="auth-btn w-100">Update</button>
                            </form> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <!-- Contact us area -->
@endsection