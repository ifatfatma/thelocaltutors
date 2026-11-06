@extends('front.layouts.layouts')

@section('content')
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url(front/img/bg-img/home-3/bg.png);">
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
    <div class="event-list-inner-page-area">
        <div class="container">
            <div class="row">
                <!-- Single Card -->
                <div class="col-md-6 col-lg-4">
                    <div class="event-card-single-inner">
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
                    <div class="event-card-single-inner">
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
                    <div class="event-card-single-inner">
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
                    <div class="event-card-single-inner">
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
                    <div class="event-card-single-inner">
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
                    <div class="event-card-single-inner">
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
                                <li class="page-item"><a class="page-link last-pagi" href="#"><i class="icon-down-arrow-11"></i></a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Event Area -->
@endsection