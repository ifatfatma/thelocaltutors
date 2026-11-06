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
                            <li>Event</li>
                        </ul>
                        <h4 class="mb-0">All Event</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Event Area -->
    <div class="event-list-inner-page-area sidebar-event-page">
        <div class="container">
            <div class="row">
                <div class="col-lg-3">
                    <div class="sidebar-content-single-area">
                        <!-- Single Card -->
                        <div class="cate-single-card">
                            <div class="cate-content-card">
                                <h3>Categories</h3>

                                <ul class="cate-list">
                                    <li><a href="#"><i class="icon-right ml-1"></i> Strongest</a>
                                        <span>4</span>
                                    </li>
                                    <li><a href="#"><i class="icon-right ml-1"></i> Elegant</a>
                                        <span>2</span>
                                    </li>
                                    <li><a href="#"><i class="icon-right ml-1"></i> Fair</a>
                                        <span>5</span>
                                    </li>
                                    <li><a href="#"><i class="icon-right ml-1"></i> Fit And Sports </a>
                                        <span>4</span>
                                    </li>
                                    <li><a href="#"><i class="icon-right ml-1"></i> Wordpress</a>
                                        <span>2</span>
                                    </li>
                                    <li><a href="#"><i class="icon-right ml-1"></i> Keep Your Body </a>
                                        <span>6</span>
                                    </li>
                                    <li><a href="#"><i class="icon-right ml-1"></i> Gym</a>
                                        <span>4</span>
                                    </li>
                                    <li><a href="#"><i class="icon-right ml-1"></i> Education & Literature </a>
                                        <span>4</span>
                                    </li>

                                </ul>
                            </div>
                        </div>

                        <!-- News Card -->
                        <div class="cate-single-card">
                            <div class="cate-content-card">
                                <h3>Latest News </h3>
                                <!-- Single news -->
                                <div class="news-cate-area d-flex align-items-center">
                                    <div class="news-img">
                                        <img src="img/bg-img/b-1.png" alt="">
                                    </div>
                                    <div class="news-content-text">
                                        <h6><a href="{{url('blog_details')}}">Egant Light Box Paper Cut Dioramas</a></h6>
                                        <p><i class="icon-clock-solid-1"></i> April 23, 2024</p>
                                    </div>
                                </div>
                                <!-- Single news -->
                                <div class="news-cate-area d-flex align-items-center">
                                    <div class="news-img">
                                        <img src="img/bg-img/b-2.png" alt="">
                                    </div>
                                    <div class="news-content-text">
                                        <h6><a href="#">Most Effective Ways for Education’s Problem</a></h6>
                                        <p><i class="icon-clock-solid-1"></i> April 23, 2024</p>
                                    </div>
                                </div>

                                <!-- Single news -->
                                <div class="news-cate-area d-flex align-items-center">
                                    <div class="news-img">
                                        <img src="img/bg-img/b-3.png" alt="">
                                    </div>
                                    <div class="news-content-text">
                                        <h6><a href="{{url('blog_details')}}">Painting Art Contest 2022 for histudy</a></h6>
                                        <p><i class="icon-clock-solid-1"></i> April 23, 2024</p>
                                    </div>
                                </div>

                                <!-- Single news -->
                                <div class="news-cate-area d-flex align-items-center">
                                    <div class="news-img">
                                        <img src="img/bg-img/b-1.png" alt="">
                                    </div>
                                    <div class="news-content-text">
                                        <h6><a href="{{url('blog_details')}}">Egant Light Box Paper Cut Dioramas</a></h6>
                                        <p><i class="icon-clock-solid-1"></i> April 23, 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tag Area -->
                        <div class="cate-single-card">
                            <div class="cate-content-card">
                                <h3>Tags</h3>
                                <ul class="tags-list">
                                    <li><a href="#">Effective</a></li>
                                    <li><a href="#">Box</a></li>
                                    <li><a href="#">Paper</a></li>
                                    <li><a href="#">Art</a></li>
                                    <li><a href="#">Strongest</a></li>
                                    <li><a href="#">WordPress</a></li>
                                    <li><a href="#">Gym</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-9">
                    <div class="row">
                        <!-- Single Card -->
                        <div class="col-md-6 col-lg-4">
                            <div class="event-card-single-inner sidebar-event">
                                <div class="event-img-inner">
                                    <img src="img/bg-img/home-3/g-4.png" alt="">
                                </div>
                                <div class="add-time-info d-flex align-items-center">
                                    <p><i class="icon-Vec1tor"></i> New York,USA</p>
                                    <p><i class="icon-clock-solid-1"></i> 9:00 am -10:00 pm</p>
                                </div>
                                <h3><a href="{{url('event_details')}}">Elegant Light Box Paper Cut Dioramas</a></h3>

                                <a class="event-btn" href="{{url('login')}}">Get Ticket</a>
                            </div>
                        </div>

                        <!-- Single Card -->
                        <div class="col-md-6 col-lg-4">
                            <div class="event-card-single-inner sidebar-event">
                                <div class="event-img-inner">
                                    <img src="img/bg-img/home-3/g-5.png" alt="">
                                </div>
                                <div class="add-time-info d-flex align-items-center">
                                    <p><i class="icon-Vec1tor"></i> New York,USA</p>
                                    <p><i class="icon-clock-solid-1"></i> 9:00 am -10:00 pm</p>
                                </div>
                                <h3><a href="{{url('event_details')}}">Ten Quick Tips For Gym.</a></h3>

                                <a class="event-btn" href="{{url('login')}}">Get Ticket</a>
                            </div>
                        </div>

                        <!-- Single Card -->
                        <div class="col-md-6 col-lg-4">
                            <div class="event-card-single-inner sidebar-event">
                                <div class="event-img-inner">
                                    <img src="img/bg-img/home-3/g-3.png" alt="">
                                </div>
                                <div class="add-time-info d-flex align-items-center">
                                    <p><i class="icon-Vec1tor"></i> New York,USA</p>
                                    <p><i class="icon-clock-solid-1"></i> 9:00 am -10:00 pm</p>
                                </div>
                                <h3><a href="{{url('event_details')}}">Elegant Light Box Paper Cut Dioramas</a></h3>

                                <a class="event-btn" href="{{url('login')}}">Get Ticket</a>
                            </div>
                        </div>

                        <!-- Single Card -->
                        <div class="col-md-6 col-lg-4">
                            <div class="event-card-single-inner sidebar-event">
                                <div class="event-img-inner">
                                    <img src="img/bg-img/home-3/g-5.png" alt="">
                                </div>
                                <div class="add-time-info d-flex align-items-center">
                                    <p><i class="icon-Vec1tor"></i> New York,USA</p>
                                    <p><i class="icon-clock-solid-1"></i> 9:00 am -10:00 pm</p>
                                </div>
                                <h3><a href="{{url('event_details')}}">Elegant Light Box Paper Cut Dioramas</a></h3>

                                <a class="event-btn" href="{{url('login')}}">Get Ticket</a>
                            </div>
                        </div>

                        <!-- Single Card -->
                        <div class="col-md-6 col-lg-4">
                            <div class="event-card-single-inner sidebar-event">
                                <div class="event-img-inner">
                                    <img src="img/bg-img/home-3/g-2.png" alt="">
                                </div>
                                <div class="add-time-info d-flex align-items-center">
                                    <p><i class="icon-Vec1tor"></i> New York,USA</p>
                                    <p><i class="icon-clock-solid-1"></i> 9:00 am -10:00 pm</p>
                                </div>
                                <h3><a href="{{url('event_details')}}">International Education Fair 2020</a></h3>

                                <a class="event-btn" href="{{url('login')}}">Get Ticket</a>
                            </div>
                        </div>

                        <!-- Single Card -->
                        <div class="col-md-6 col-lg-4">
                            <div class="event-card-single-inner sidebar-event">
                                <div class="event-img-inner">
                                    <img src="img/bg-img/home-3/g-4.png" alt="">
                                </div>
                                <div class="add-time-info d-flex align-items-center">
                                    <p><i class="icon-Vec1tor"></i> New York,USA</p>
                                    <p><i class="icon-clock-solid-1"></i> 9:00 am -10:00 pm</p>
                                </div>
                                <h3><a href="{{url('event_details')}}">Elegant Light Box Paper Cut Dioramas</a></h3>

                                <a class="event-btn" href="{{url('login')}}">Get Ticket</a>
                            </div>
                        </div>

                        <div class="col-12 mt-5">
                            <div class="pagination-area">
                                <nav aria-label="Page navigation example">
                                    <ul class="pagination justify-content-center">
                                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                                        <li class="page-item"><a class="page-link last-pagi" href="#"><i
                                                    class="icon-down-arrow-11"></i></a></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Event Area -->

@endsection     