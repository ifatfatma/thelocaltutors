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
                            <li>Blog</li>
                        </ul>
                        <h4 class="mb-0">Blog</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Blog Area -->
    <div class="blog-area single-page-blog">
        <div class="container">
            <div class="row">
                <!-- Single Card -->
                <div class="col-md-6 col-xl-4">
                    <div class="single-blog-artical relative">
                        <div class="single-blog-card relative">
                            <div class="deft-blog-content-info relative">
                                <!-- img -->
                                <div class="blog-img relative">
                                    <img class="relative" src="img/bg-img/b-1.png" alt="">
                                </div>

                                <!-- Content -->
                                <div class="blog-content-text text-center">
                                    <!-- badge -->
                                    <div class="date-badge">
                                        <div class="wow fadeInLeft" data-wow-delay="500ms">
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                </div>
                            </div>
                            <!-- Hover Content -->
                            <div class="hover-blog-content-img text-center">
                                <div class="b-shape-img">
                                    <div class="date-badge">
                                        <div>
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="hover-blog-content">
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</p>
                                </div>
                            </div>

                        </div>
                        <!-- Btn -->
                        <div class="blog-btn-area">
                            <a class="blog-btn" href="{{url('blog_details')}}"><span
                                    class="icon-right-arrow"></span></a>
                        </div>
                    </div>
                </div>

                <!-- Single Card -->
                <div class="col-md-6 col-xl-4">
                    <div class="single-blog-artical relative">
                        <div class="single-blog-card relative">
                            <div class="deft-blog-content-info relative">
                                <!-- img -->
                                <div class="blog-img relative">
                                    <img class="relative" src="img/bg-img/b-2.png" alt="">
                                </div>

                                <!-- Content -->
                                <div class="blog-content-text text-center">
                                    <!-- badge -->
                                    <div class="date-badge">
                                        <div class="wow fadeInLeft" data-wow-delay="700ms">
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online
                                            Course</a></h3>
                                </div>
                            </div>
                            <!-- Hover Content -->
                            <div class="hover-blog-content-img text-center">
                                <div class="b-shape-img">
                                    <div class="date-badge">
                                        <div class="wow fadeInLeft" data-wow-delay="1100ms">
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="hover-blog-content">
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</p>
                                </div>
                            </div>

                        </div>
                        <!-- Btn -->
                        <div class="blog-btn-area">
                            <a class="blog-btn" href="{{url('blog_details')}}"><span
                                    class="icon-right-arrow"></span></a>
                        </div>
                    </div>
                </div>

                <!-- Single Card -->
                <div class="col-md-6 col-xl-4">
                    <div class="single-blog-artical relative">
                        <div class="single-blog-card relative">
                            <div class="deft-blog-content-info relative">
                                <!-- img -->
                                <div class="blog-img relative">
                                    <img class="relative" src="img/bg-img/b-1.png" alt="">
                                </div>

                                <!-- Content -->
                                <div class="blog-content-text text-center">
                                    <!-- badge -->
                                    <div class="date-badge">
                                        <div class="wow fadeInLeft" data-wow-delay="900ms">
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                </div>
                            </div>
                            <!-- Hover Content -->
                            <div class="hover-blog-content-img text-center">
                                <div class="b-shape-img">
                                    <div class="date-badge">
                                        <div>
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="hover-blog-content">
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</p>
                                </div>
                            </div>

                        </div>
                        <!-- Btn -->
                        <div class="blog-btn-area">
                            <a class="blog-btn" href="{{url('blog_details')}}"><span
                                    class="icon-right-arrow"></span></a>
                        </div>
                    </div>
                </div>

                <!-- Single Card -->
                <div class="col-md-6 col-xl-4">
                    <div class="single-blog-artical relative">
                        <div class="single-blog-card relative">
                            <div class="deft-blog-content-info relative">
                                <!-- img -->
                                <div class="blog-img relative">
                                    <img class="relative" src="img/bg-img/b-1.png" alt="">
                                </div>

                                <!-- Content -->
                                <div class="blog-content-text text-center">
                                    <!-- badge -->
                                    <div class="date-badge">
                                        <div class="wow fadeInLeft" data-wow-delay="500ms">
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                </div>
                            </div>
                            <!-- Hover Content -->
                            <div class="hover-blog-content-img text-center">
                                <div class="b-shape-img">
                                    <div class="date-badge">
                                        <div>
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="hover-blog-content">
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</p>
                                </div>
                            </div>

                        </div>
                        <!-- Btn -->
                        <div class="blog-btn-area">
                            <a class="blog-btn" href="{{url('blog_details')}}"><span
                                    class="icon-right-arrow"></span></a>
                        </div>
                    </div>
                </div>

                <!-- Single Card -->
                <div class="col-md-6 col-xl-4">
                    <div class="single-blog-artical relative">
                        <div class="single-blog-card relative">
                            <div class="deft-blog-content-info relative">
                                <!-- img -->
                                <div class="blog-img relative">
                                    <img class="relative" src="img/bg-img/b-2.png" alt="">
                                </div>

                                <!-- Content -->
                                <div class="blog-content-text text-center">
                                    <!-- badge -->
                                    <div class="date-badge">
                                        <div class="wow fadeInLeft" data-wow-delay="700ms">
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                </div>
                            </div>
                            <!-- Hover Content -->
                            <div class="hover-blog-content-img text-center">
                                <div class="b-shape-img">
                                    <div class="date-badge">
                                        <div class="wow fadeInLeft" data-wow-delay="1100ms">
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="hover-blog-content">
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</p>
                                </div>
                            </div>

                        </div>
                        <!-- Btn -->
                        <div class="blog-btn-area">
                            <a class="blog-btn" href="{{url('blog_details')}}"><span
                                    class="icon-right-arrow"></span></a>
                        </div>
                    </div>
                </div>

                <!-- Single Card -->
                <div class="col-md-6 col-xl-4">
                    <div class="single-blog-artical relative">
                        <div class="single-blog-card relative">
                            <div class="deft-blog-content-info relative">
                                <!-- img -->
                                <div class="blog-img relative">
                                    <img class="relative" src="img/bg-img/b-1.png" alt="">
                                </div>

                                <!-- Content -->
                                <div class="blog-content-text text-center">
                                    <!-- badge -->
                                    <div class="date-badge">
                                        <div class="wow fadeInLeft" data-wow-delay="900ms">
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                </div>
                            </div>
                            <!-- Hover Content -->
                            <div class="hover-blog-content-img text-center">
                                <div class="b-shape-img">
                                    <div class="date-badge">
                                        <div>
                                            <h5>06</h5>
                                            <p>April</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="hover-blog-content">
                                    <div class="blog-header d-flex justify-content-center">
                                        <p><span class="icon-user-2"></span> admin</p>
                                        <p><span class="icon-chat-bubble"></span> 0 comments</p>
                                    </div>
                                    <h3><a href="{{url('blog_details')}}">Now You Can Use AI to Create Your Online Course</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</p>
                                </div>
                            </div>

                        </div>
                        <!-- Btn -->
                        <div class="blog-btn-area">
                            <a class="blog-btn" href="#"><span class="icon-right-arrow"></span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Blog Area -->
@endsection