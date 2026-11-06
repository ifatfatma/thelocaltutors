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
                            <li>Elegant Light Box Paper Cut Dioramas
                            </li>
                        </ul>
                        <h4 class="mb-0">Elegant Light Box Paper Cut Dioramas
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Team Area -->
    <div class="shop-area">
        <div class="container">
            <div class="row">
                <!-- Shop Card -->
                <div class="col-md-6 col-lg-4">
                    <div class="shop-card-single text-center">
                        <div class="shop-img">
                            <img src="img/bg-img/inner/shop-1.png" alt="">
                        </div>
                        <div class="shop-content">
                            <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                            <h4><a href="#">Invisible Man</a></h4>
                            <p class="auth-info">By  <a href="#">Ralph Ellison</a></p>

                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$150 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="#"><i class="icon-icon_cart_alt"></i> <span>Add to cart</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                    <!-- Shop Card -->
                    <div class="col-md-6 col-lg-4">
                    <div class="shop-card-single text-center">
                        <div class="shop-img">
                            <img src="img/bg-img/inner/shop-2.png" alt="">
                        </div>
                        <div class="shop-content">
                            <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                            <h4><a href="{{url('shop_details')}}">The Book Thief</a></h4>
                            <p class="auth-info">By  <a href="#">Ralph Ellison</a></p>

                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$90</p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="{{url('cart')}}"><i class="icon-icon_cart_alt"></i> <span>Add to cart</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                    <!-- Shop Card -->
                    <div class="col-md-6 col-lg-4">
                    <div class="shop-card-single text-center">
                        <div class="shop-img">
                            <img src="img/bg-img/inner/shop-3.png" alt="">
                        </div>
                        <div class="shop-content">
                            <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                            <h4><a href="{{url('shop_details')}}">The Road</a></h4>
                            <p class="auth-info">By  <a href="#">Ralph Ellison</a></p>

                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$150</p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="{{url('cart')}}"><i class="icon-icon_cart_alt"></i> <span>Add to cart</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                    <!-- Shop Card -->
                    <div class="col-md-6 col-lg-4">
                    <div class="shop-card-single text-center">
                        <div class="shop-img">
                            <img src="img/bg-img/inner/shop-4.png" alt="">
                        </div>
                        <div class="shop-content">
                            <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                            <h4><a href="{{url('shop_details')}}">The Remaking</a></h4>
                            <p class="auth-info">By  <a href="#">Ralph Ellison</a></p>

                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$150 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="{{url('cart')}}"><i class="icon-icon_cart_alt"></i> <span>Add to cart</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                    <!-- Shop Card -->
                    <div class="col-md-6 col-lg-4">
                    <div class="shop-card-single text-center">
                        <div class="shop-img">
                            <img src="img/bg-img/inner/shop-5.png" alt="">
                        </div>
                        <div class="shop-content">
                            <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                            <h4><a href="{{url('shop_details')}}">The Momemtum Theorem</a></h4>
                            <p class="auth-info">By  <a href="#">Ralph Ellison</a></p>

                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$150 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="{{url('cart')}}"><i class="icon-icon_cart_alt"></i> <span>Add to cart</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <!-- Shop Card -->
                    <div class="col-md-6 col-lg-4">
                    <div class="shop-card-single text-center">
                        <div class="shop-img">
                            <img src="img/bg-img/inner/shop-1.png" alt="">
                        </div>
                        <div class="shop-content">
                            <p><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                            <h4><a href="{{url('shop_details')}}">Invisible Man</a></h4>
                            <p class="auth-info">By  <a href="#">Ralph Ellison</a></p>

                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$150 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="{{url('cart')}}"><i class="icon-icon_cart_alt"></i> <span>Add to cart</span></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Team Area -->
@endsection