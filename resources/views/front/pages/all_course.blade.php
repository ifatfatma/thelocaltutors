@extends('front.layouts.layouts')

@section('content')
    <div class="breadcrumb-area relative">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li>Home</li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>Courses</li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>All Courses</li>
                        </ul>
                        <h4>All Courses</h4>
                    </div>
                </div>
            </div>
        </div>
        <!-- Filter Search -->
        <div class="grid-filter-area">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <!-- Filter -->
                        <div class="grid-filter-search d-flex align-items-center justify-content-between">
                            <div class="grid-filter-btn d-flex align-items-center">
                                <div class="grid-filter-btn-list">
                                    <button class="grid-btn"><i class="icon-mingcute_grid-line"></i>
                                        <span>Grid</span></button>
                                    <button class="list-btn"><i class="icon-cil_list"></i>
                                        <span>List</span></button>
                                </div>
                                <p class="mb-0">Showing 1-6 of 19 results</p>
                            </div>
                            <button class="filter-btn"><i class="icon-mdi_filter-outline"></i>
                                <span>Filter</span></button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Featured Course Area -->
    <div class="featured-course-4-area single-page">
        <div class="container">
            <div class="row">
                <!-- Single Card -->
                <div class="col-md-6 col-lg-4">
                    <div class="course-card-4-area">
                        <!-- Shape -->
                        <div class="care-shape-4 wow fadeInDown" data-wow-delay="700ms">
                            <img src="img/bg-img/home-2/care-shap.png" alt="">
                        </div>
                        <div class="course-img-4 bg-img"
                            style="background-image: url(img/bg-img/home-4/shape-2.png);">
                            <div class="course-sub-title">
                                <h6>PHP Beginner</h6>
                            </div>
                            <div class="course-title-img">
                                <img src="img/bg-img/home-4/c-1.png" alt="">
                            </div>
                            <!-- Shape -->
                            <div class="course-shape-4">
                                <img src="{{url('img/bg-img/home-4/shape-3.png')}}" alt="">
                            </div>

                            <div class="course-offer-4">
                                <div class="offer-bg-shape relative">
                                    <img src="{{url('img/bg-img/home-4/Common::setting()')}}" alt="">
                                </div>
                                <div class="offer-content-4 ">
                                    <p>-20%</p>
                                    <span>Off</span>
                                </div>

                            </div>
                        </div>
                        <!-- Content -->
                        <div class="course-content-info-4">
                            <div
                                class="course-content-rating d-flex justify-content-between align-items-center">
                                <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                                <div class="ribbon-icon">
                                    <i class="icon-icon_ribbon_alt"></i>
                                </div>
                            </div>
                            <!-- info -->
                            <div class="course-info-meta-4 d-flex align-items-center">
                                <p><i class="icon-Home"></i> 1 Student</p>
                                <p><i class="icon-book-solid-1"></i> 8 Lessone</p>
                            </div>
                            <h2><a href="{{url('course_details')}}">Node Js Front to Back</a></h2>
                            <p class="course-desc-4">Podcasts like Wow in the World, Brains On!, and But Why?
                                cover
                                interesting.</p>
                            <div class="auth-info-4 d-flex align-items-center">
                                <img class="auth-img" src="img/bg-img/home-4/c-2.png" alt="">
                                <p>By <a href="#">jane cooper</a></p>
                            </div>
                            <!-- Price & Cart -->
                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$150 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="#"><i class="icon-icon_cart_alt"></i> <span>Add to
                                                cart</span></a>
                                    </p>
                                </div>
                            </div>

                        </div>


                    </div>
                </div>

                <!-- Single Card -->
                <div class="col-md-6 col-lg-4">
                    <div class="course-card-4-area">
                        <!-- Shape -->
                        <div class="care-shape-4 wow fadeInDown" data-wow-delay="700ms">
                            <img src="img/bg-img/home-2/care-shap.png" alt="">
                        </div>
                        <div class="course-img-4 bg-img"
                            style="background-image: url(img/bg-img/home-4/shape-2.png);">
                            <div class="course-sub-title">
                                <h6>PHP Beginner</h6>
                            </div>
                            <div class="course-title-img four">
                                <img src="img/bg-img/home-4/c-3.png" alt="">
                            </div>
                            <!-- Shape -->
                            <div class="course-shape-4">
                                <img src="img/bg-img/home-4/shape-3.png" alt="">
                            </div>
                        </div>
                        <!-- Content -->
                        <div class="course-content-info-4">
                            <div
                                class="course-content-rating d-flex justify-content-between align-items-center">
                                <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                                <div class="ribbon-icon">
                                    <i class="icon-icon_ribbon_alt"></i>
                                </div>
                            </div>
                            <!-- info -->
                            <div class="course-info-meta-4 d-flex align-items-center">
                                <p><i class="icon-Home"></i> 1 Student</p>
                                <p><i class="icon-book-solid-1"></i> 8 Lessone</p>
                            </div>
                            <h2><a href="{{url('course_details')}}">PHP Beginner Advanced</a></h2>
                            <p class="course-desc-4">Podcasts like Wow in the World, Brains On!, and But Why?
                                cover
                                interesting.</p>
                            <div class="auth-info-4 d-flex align-items-center">
                                <img class="auth-img" src="img/bg-img/home-4/c-8.png" alt="">
                                <p>By <a href="#">jane cooper</a></p>
                            </div>
                            <!-- Price & Cart -->
                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$99 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="#"><i class="icon-icon_cart_alt"></i> <span>Add to
                                                cart</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Single Card -->
                <div class="col-md-6 col-lg-4">
                    <div class="course-card-4-area">
                        <!-- Shape -->
                        <div class="care-shape-4 wow fadeInDown" data-wow-delay="700ms">
                            <img src="img/bg-img/home-2/care-shap.png" alt="">
                        </div>
                        <div class="course-img-4 bg-img"
                            style="background-image: url(img/bg-img/home-4/shape-2.png);">
                            <div class="course-sub-title">
                                <h6>PHP Beginner</h6>
                            </div>
                            <div class="course-title-img">
                                <img src="img/bg-img/home-4/c-4.png" alt="">
                            </div>
                            <!-- Shape -->
                            <div class="course-shape-4">
                                <img src="img/bg-img/home-4/shape-3.png" alt="">
                            </div>
                        </div>
                        <!-- Content -->
                        <div class="course-content-info-4">
                            <div
                                class="course-content-rating d-flex justify-content-between align-items-center">
                                <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                                <div class="ribbon-icon">
                                    <i class="icon-icon_ribbon_alt"></i>
                                </div>
                            </div>
                            <!-- info -->
                            <div class="course-info-meta-4 d-flex align-items-center">
                                <p><i class="icon-Home"></i> 1 Student</p>
                                <p><i class="icon-book-solid-1"></i> 8 Lessone</p>
                            </div>
                            <h2><a href="{{url('course-details')}}">Angular Zero to Mastery</a></h2>
                            <p class="course-desc-4">Podcasts like Wow in the World, Brains On!, and But Why?
                                cover
                                interesting.</p>
                            <div class="auth-info-4 d-flex align-items-center">
                                <img class="auth-img" src="img/bg-img/home-4/c-2.png" alt="">
                                <p>By <a href="#">Darrell Steward</a></p>
                            </div>
                            <!-- Price & Cart -->
                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$250 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="#"><i class="icon-icon_cart_alt"></i> <span>Add to
                                                cart</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Single Card -->
                <div class="col-md-6 col-lg-4">
                    <div class="course-card-4-area">
                        <!-- Shape -->
                        <div class="care-shape-4 wow fadeInDown" data-wow-delay="700ms">
                            <img src="img/bg-img/home-2/care-shap.png" alt="">
                        </div>
                        <div class="course-img-4 bg-img"
                            style="background-image: url(img/bg-img/home-4/shape-5.png);">
                            <div class="course-title-img-four">
                                <img src="img/bg-img/home-4/c-5.png" alt="">
                            </div>
                            <!-- Shape -->
                            <div class="course-shape-4">
                                <img src="img/bg-img/home-4/shape-3.png" alt="">
                            </div>

                            <div class="course-sub-heading-4">
                                <h6>Difficult Things <br>
                                    About Education</h6>
                                <span>20 class</span>
                            </div>
                        </div>
                        <!-- Content -->
                        <div class="course-content-info-4">
                            <div
                                class="course-content-rating d-flex justify-content-between align-items-center">
                                <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                                <div class="ribbon-icon">
                                    <i class="icon-icon_ribbon_alt"></i>
                                </div>
                            </div>
                            <!-- info -->
                            <div class="course-info-meta-4 d-flex align-items-center">
                                <p><i class="icon-Home"></i> 1 Student</p>
                                <p><i class="icon-book-solid-1"></i> 8 Lessone</p>
                            </div>
                            <h2><a href="{{url('course-details')}}">React Beginner</a></h2>
                            <p class="course-desc-4">Podcasts like Wow in the World, Brains On!, and But Why?
                                cover
                                interesting.</p>
                            <div class="auth-info-4 d-flex align-items-center">
                                <img class="auth-img" src="img/bg-img/home-4/c-2.png" alt="">
                                <p>By <a href="#">Darrell Steward</a></p>
                            </div>
                            <!-- Price & Cart -->
                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$250 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="#"><i class="icon-icon_cart_alt"></i> <span>Add to
                                                cart</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Single Card -->
                <div class="col-md-6 col-lg-4">
                    <div class="course-card-4-area">
                        <!-- Shape -->
                        <div class="care-shape-4 wow fadeInDown" data-wow-delay="700ms">
                            <img src="img/bg-img/home-2/care-shap.png" alt="">
                        </div>
                        <div class="course-img-4 bg-img"
                            style="background-image: url(img/bg-img/home-4/shape-2.png);">
                            <div class="course-sub-title">
                                <h6>PHP Beginner</h6>
                            </div>
                            <div class="course-title-img">
                                <img src="img/bg-img/home-4/c-6.png" alt="">
                            </div>
                            <!-- Shape -->
                            <div class="course-shape-4">
                                <img src="img/bg-img/home-4/shape-3.png" alt="">
                            </div>

                            <div class="course-offer-4">
                                <div class="offer-bg-shape relative">
                                    <img src="img/bg-img/home-4/Common::setting()" alt="">
                                </div>
                                <div class="offer-content-4 ">
                                    <p>-20%</p>
                                    <span>Off</span>
                                </div>

                            </div>
                        </div>
                        <!-- Content -->
                        <div class="course-content-info-4">
                            <div
                                class="course-content-rating d-flex justify-content-between align-items-center">
                                <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                                <div class="ribbon-icon">
                                    <i class="icon-icon_ribbon_alt"></i>
                                </div>
                            </div>
                            <!-- info -->
                            <div class="course-info-meta-4 d-flex align-items-center">
                                <p><i class="icon-Home"></i> 1 Student</p>
                                <p><i class="icon-book-solid-1"></i> 8 Lessone</p>
                            </div>
                            <h2><a href="{{url('course_details')}}">SQL Beginner</a></h2>
                            <p class="course-desc-4">Podcasts like Wow in the World, Brains On!, and But Why?
                                cover
                                interesting.</p>
                            <div class="auth-info-4 d-flex align-items-center">
                                <img class="auth-img" src="img/bg-img/home-4/c-10.png" alt="">
                                <p>By <a href="#">jane cooper</a></p>
                            </div>
                            <!-- Price & Cart -->
                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$150 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="#"><i class="icon-icon_cart_alt"></i> <span>Add to
                                                cart</span></a>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Single Card -->
                <div class="col-md-6 col-lg-4">
                    <div class="course-card-4-area">
                        <!-- Shape -->
                        <div class="care-shape-4 wow fadeInDown" data-wow-delay="700ms">
                            <img src="img/bg-img/home-2/care-shap.png" alt="">
                        </div>
                        <div class="course-img-4 bg-img"
                            style="background-image: url(img/bg-img/home-4/shape-2.png);">
                            <div class="course-title-img-four">
                                <img src="img/bg-img/home-4/c-7.png" alt="">
                            </div>
                            <!-- Shape -->
                            <div class="course-shape-4">
                                <img src="img/bg-img/home-4/shape-3.png" alt="">
                            </div>

                            <div class="course-sub-heading-4">
                                <h6>Difficult Things <br>
                                    About Education</h6>
                                <span>20 class</span>
                            </div>
                        </div>
                        <!-- Content -->
                        <div class="course-content-info-4">
                            <div
                                class="course-content-rating d-flex justify-content-between align-items-center">
                                <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                                <div class="ribbon-icon">
                                    <i class="icon-icon_ribbon_alt"></i>
                                </div>
                            </div>
                            <!-- info -->
                            <div class="course-info-meta-4 d-flex align-items-center">
                                <p><i class="icon-Home"></i> 1 Student</p>
                                <p><i class="icon-book-solid-1"></i> 8 Lessone</p>
                            </div>
                            <h2><a href="{{url('course_details')}}">SQL Advanced</a></h2>
                            <p class="course-desc-4">Podcasts like Wow in the World, Brains On!, and But Why?
                                cover
                                interesting.</p>
                            <div class="auth-info-4 d-flex align-items-center">
                                <img class="auth-img" src="img/bg-img/home-4/c-9.png" alt="">
                                <p>By <a href="#">Darrell Steward</a></p>
                            </div>
                            <!-- Price & Cart -->
                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$250 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="#"><i class="icon-icon_cart_alt"></i> <span>Add to
                                                cart</span></a>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="col-12">
                    <div class="load-btn-area text-center mt-20">
                        <a class="load-btn" href="#"><i class="icon-icon_document_alt"></i> Load More</a>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <!-- Featured Course Area -->
@endsection