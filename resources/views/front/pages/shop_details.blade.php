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
                            <li>Shop Single</li>
                        </ul>
                        <h4 class="mb-0">Shop Single</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Shop Cart Area -->
    <div class="shop-cart-area">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="add-card-alert-area">
                        <p><i class="icon-maps-an1d-flags"></i> <span><span class="font-bold">“Invisible Man”</span> has been added to your cart.</span></p>
                        <a class="cart-btn" href="{{url('cart')}}">View Cart</a>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="product-single-img text-center">
                        <img src="{{asset('front/img/bg-img/inner/shop-1.png')}}" alt="">
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="product-info-details-area">
                        <p class="product-rating"><i class="icon-star1"></i> 4.5 <span>(0 Reviews)</span></p>
                        <h4>Invisible Man</h4>
                        <p class="pro-auth">By <a href="#">jane cooper</a></p>
                        <h2>$255.25</h2>

                        <div class="qty-pro-area">
                            <p>Quantity : </p>
                            <form class="cart-form">
                                <div class="order-plus-minus d-flex align-items-center">
                                    <div class="quantity-button-handler">-</div>
                                    <input class="form-control cart-quantity-input" type="text" 
                                        name="quantity" value="3">
                                    <div class="quantity-button-handler">+</div>
                                </div>
                                <button class="cart-btn ms-5" type="submit">Add To Cart</button>
                            </form>
                        </div>

                        <p class="product-desc">
                            Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>

                        <h5>Categories : <span>UX / UI Design</span> </h5>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="shop-detials-tab">
                        <ul class="nav nav-pills product-tab-title" id="pills-tab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-home" type="button" role="tab"
                                    aria-controls="pills-home" aria-selected="true"> Description</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-profile" type="button" role="tab"
                                    aria-controls="pills-profile" aria-selected="false">
                                    Additional information </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-contact" type="button" role="tab"
                                    aria-controls="pills-contact" aria-selected="false">
                                    Reviews (1)
                                </button>
                            </li>
                        </ul>
                        <div class="tab-content" id="pills-tabContent">
                            <div class="tab-pane fade show active" id="pills-home" role="tabpanel"
                                aria-labelledby="pills-home-tab" tabindex="0">
                                <div class="product-details-tab-content">
                                    <p>Dorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliquat enim ad minim
                                        veniam, quriesstrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat. Duis aute irure dolor in reprehenderit in
                                        volueryptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        Excepteur sint occaecat cupidatat non proi dent, sunt in culpa qui
                                        offici area follow deserunt mollit anim id est laborum. Sed ut
                                        perspiciatis unde omnis iste natus error sit voluptate.</p>

                                    <p>Dorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliquat enim ad minim
                                        veniam, quriesstrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat. Duis aute irure dolor in reprehenderit in
                                        volueryptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        Excepteur sint occaecat cupidatat non proi dent, sunt in culpa qui
                                        offici area follow deserunt mollit anim id est laborum. Sed ut
                                        perspiciatis unde omnis iste natus error sit voluptate.</p>

                                </div>
                            </div>
                            <div class="tab-pane fade" id="pills-profile" role="tabpanel"
                                aria-labelledby="pills-profile-tab" tabindex="0">
                                <div class="product-details-tab-content">
                                    <p>Dorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliquat enim ad minim
                                        veniam, quriesstrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat. Duis aute irure dolor in reprehenderit in
                                        volueryptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        Excepteur sint occaecat cupidatat non proi dent, sunt in culpa qui
                                        offici area follow deserunt mollit anim id est laborum. Sed ut
                                        perspiciatis unde omnis iste natus error sit voluptate.</p>

                                    <p>Dorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliquat enim ad minim
                                        veniam, quriesstrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat. Duis aute irure dolor in reprehenderit in
                                        volueryptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        Excepteur sint occaecat cupidatat non proi dent, sunt in culpa qui
                                        offici area follow deserunt mollit anim id est laborum. Sed ut
                                        perspiciatis unde omnis iste natus error sit voluptate.</p>

                                </div>
                            </div>
                            <div class="tab-pane fade" id="pills-contact" role="tabpanel"
                                aria-labelledby="pills-contact-tab" tabindex="0">
                                <div class="product-details-tab-content">
                                    <p>Dorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliquat enim ad minim
                                        veniam, quriesstrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat. Duis aute irure dolor in reprehenderit in
                                        volueryptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        Excepteur sint occaecat cupidatat non proi dent, sunt in culpa qui
                                        offici area follow deserunt mollit anim id est laborum. Sed ut
                                        perspiciatis unde omnis iste natus error sit voluptate.</p>

                                    <p>Dorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliquat enim ad minim
                                        veniam, quriesstrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat. Duis aute irure dolor in reprehenderit in
                                        volueryptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        Excepteur sint occaecat cupidatat non proi dent, sunt in culpa qui
                                        offici area follow deserunt mollit anim id est laborum. Sed ut
                                        perspiciatis unde omnis iste natus error sit voluptate.</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Shop Cart Area -->

    <!-- shop Area -->
    <div class="shop-area shop-single">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h4 class="simi-title">Similar Books.</h4>
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
                            <p class="auth-info">By <a href="#">Ralph Ellison</a></p>

                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$150 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="{{url('cart')}}"><i class="icon-icon_cart_alt"></i> <span>Add to
                                                cart</span></a>
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
                            <p class="auth-info">By <a href="#">Ralph Ellison</a></p>

                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$150 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="{{url('cart')}}"><i class="icon-icon_cart_alt"></i> <span>Add to
                                                cart</span></a>
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
                            <p class="auth-info">By <a href="#">Ralph Ellison</a></p>

                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>$150 <span>$100</span></p>
                                </div>
                                <div class="course-buy">
                                    <p><a href="{{url('cart')}}"><i class="icon-icon_cart_alt"></i> <span>Add to
                                                cart</span></a>
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