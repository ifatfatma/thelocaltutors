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
                            <li>Student </li>
                        </ul>
                        <h4 class="mb-0">Student Panel</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Login & Register Area -->
    <div class="course-details-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <p class="wow fadeInRight" data-wow-delay="1100ms">
                        <div class="row">
                            <div class="col-lg-4">
                                <select class="form-select mt-1">
                                    <option>Looking For?</option>
                                    <option>Tutor</option>
                                    <option>Coaching Centre</option>
                                    <option>Computer Centre</option>
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <select class="form-select mt-1">
                                    <option>State</option>
                                    <option>Coaching Centre</option>
                                    <option>Computer Centre</option>
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <select class="form-select mt-1">
                                    <option>District</option>
                                    <option>Coaching Centre</option>
                                    <option>Computer Centre</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-4">
                                <select class="form-select mt-1">
                                    <option>Location distance</option>
                                    <option>1 KM radius</option>
                                    <option>2 KM radius Centre</option>
                                    <option>3 KM radius Centre</option>
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <select class="form-select mt-1">
                                    <option>Class</option>
                                    <option>1</option>
                                    <option>2</option>
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <select class="form-select mt-1">
                                    <option>Board</option>
                                    <option>WBBSE</option>
                                    <option>BBSE</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-4">
                                <select class="form-select mt-1">
                                    <option>Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Both</option>
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <button type="button" name="" class="mt-1 auth-btn w-100 p-1 btn-sm" value="Search"><span class="icon-icon_search2"></span> Search</button>
                            </div>
                            
                        </div>
                    </p>
                    <div class="course-details-content-area">
                                                        

                        <div class="other-ins-area">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="inst-member-info d-flex align-items-center">
                                        <div class="inst-img">
                                            <img src="img/bg-img/t-1.jpg" alt="">
                                        </div>
                                        <div class="inst-info">
                                            <h4>Jessica Brown</h4>
                                            <p>Associate Professor</p>
                                            <ul class="inst-social-list">
                                                <li><a href="#"><span class="icon-facebook-f"></span></a></li>
                                                <li><a href="#"><span class="icon-instagram"></span></a></li>
                                                <li><a href="#"><span class="icon-linkedin-in"></span></a></li>
                                                <li><a href="#"><span class="icon-instagram"></span></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="inst-member-info d-flex align-items-center">
                                        <div class="inst-img">
                                            <img src="img/bg-img/t-2.jpg" alt="">
                                        </div>
                                        <div class="inst-info">
                                            <h4>Ralph Edwards</h4>
                                            <p> Teaching Assistant</p>
                                            <ul class="inst-social-list">
                                                <li><a href="#"><span class="icon-facebook-f"></span></a></li>
                                                <li><a href="#"><span class="icon-instagram"></span></a></li>
                                                <li><a href="#"><span class="icon-linkedin-in"></span></a></li>
                                                <li><a href="#"><span class="icon-instagram"></span></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="inst-member-info d-flex align-items-center">
                                        <div class="inst-img">
                                            <img src="img/bg-img/t-3.jpg" alt="">
                                        </div>
                                        <div class="inst-info">
                                            <h4>Ralph Edwards</h4>
                                            <p>Nursing Staff</p>
                                            <ul class="inst-social-list">
                                                <li><a href="#"><span class="icon-facebook-f"></span></a></li>
                                                <li><a href="#"><span class="icon-instagram"></span></a></li>
                                                <li><a href="#"><span class="icon-linkedin-in"></span></a></li>
                                                <li><a href="#"><span class="icon-instagram"></span></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="inst-member-info d-flex align-items-center">
                                        <div class="inst-img">
                                            <img src="img/bg-img/t-1.jpg" alt="">
                                        </div>
                                        <div class="inst-info">
                                            <h4>Jessica Brown</h4>
                                            <p>Associate Professor</p>
                                            <ul class="inst-social-list">
                                                <li><a href="#"><span class="icon-facebook-f"></span></a></li>
                                                <li><a href="#"><span class="icon-instagram"></span></a></li>
                                                <li><a href="#"><span class="icon-linkedin-in"></span></a></li>
                                                <li><a href="#"><span class="icon-instagram"></span></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    </div>
    <!-- Login & Register Area -->
@endsection