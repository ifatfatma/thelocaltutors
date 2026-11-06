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
                            <li>Elegant Light Box Paper Cut Dioramas</li>
                        </ul>
                        <h4 class="mb-0">Elegant Light Box Paper Cut Dioramas</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="course-details-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-8">
                    <div class="course-details-content-area">
                        <div class="course-bg-img mt-0">
                            <img src="img/bg-img/inner/course.png" alt="">
                        </div>
                        <div class="course-detials-tab">
                            <ul class="nav nav-pills course-tab-title" id="pills-tab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill"
                                        data-bs-target="#pills-home" type="button" role="tab"
                                        aria-controls="pills-home" aria-selected="true"> Features</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                        data-bs-target="#pills-profile" type="button" role="tab"
                                        aria-controls="pills-profile" aria-selected="false">
                                        Description</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill"
                                        data-bs-target="#pills-contact" type="button" role="tab"
                                        aria-controls="pills-contact" aria-selected="false">
                                        Participants</button>
                                </li>
                            </ul>
                            <div class="tab-content" id="pills-tabContent">
                                <div class="tab-pane fade show active" id="pills-home" role="tabpanel"
                                    aria-labelledby="pills-home-tab" tabindex="0">
                                    <div class="event-details-tab-content">
                                        <h4>Event Features</h4>
                                        <ul class="event-details-list">
                                            <li><span class="event-icon-single"><i
                                                        class="icon-maps-and-flags4"></i></span> Provide
                                                additional
                                                resources such as readings, articles, videos,
                                                or online tutorials for learners who want to explore the details
                                                further. Offer recommendations for reputable sources to ensure
                                                quality information. Assess learners' understanding of the
                                                details through quizzes.</li>

                                            <li><span class="event-icon-single"><i
                                                        class="icon-maps-and-flags4"></i></span> Lorem ipsum
                                                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                                sunt in culpa qui officia deserunt mollit anim id est laborum.
                                            </li>

                                            <li><span class="event-icon-single"><i
                                                        class="icon-maps-and-flags4"></i></span> Provide
                                                additional
                                                resources such as readings, articles, videos,
                                                or online tutorials for learners who want to explore the details
                                                further. Offer recommendations for reputable sources to ensure
                                                quality information. Assess learners' understanding of the
                                                details through quizzes.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="pills-profile" role="tabpanel"
                                    aria-labelledby="pills-profile-tab" tabindex="0">
                                    <div class="event-details-tab-content">
                                        <h4>Event Features</h4>
                                        <ul class="event-details-list">
                                            <li><span class="event-icon-single"><i
                                                        class="icon-maps-and-flags4"></i></span> Provide
                                                additional
                                                resources such as readings, articles, videos,
                                                or online tutorials for learners who want to explore the details
                                                further. Offer recommendations for reputable sources to ensure
                                                quality information. Assess learners' understanding of the
                                                details through quizzes.</li>

                                            <li><span class="event-icon-single"><i
                                                        class="icon-maps-and-flags4"></i></span> Lorem ipsum
                                                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                                sunt in culpa qui officia deserunt mollit anim id est laborum.
                                            </li>

                                            <li><span class="event-icon-single"><i
                                                        class="icon-maps-and-flags4"></i></span> Provide
                                                additional
                                                resources such as readings, articles, videos,
                                                or online tutorials for learners who want to explore the details
                                                further. Offer recommendations for reputable sources to ensure
                                                quality information. Assess learners' understanding of the
                                                details through quizzes.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="pills-contact" role="tabpanel"
                                    aria-labelledby="pills-contact-tab" tabindex="0">
                                    <div class="event-details-tab-content">
                                        <h4>Event Features</h4>
                                        <ul class="event-details-list">
                                            <li><span class="event-icon-single"><i
                                                        class="icon-maps-and-flags4"></i></span> Provide
                                                additional
                                                resources such as readings, articles, videos,
                                                or online tutorials for learners who want to explore the details
                                                further. Offer recommendations for reputable sources to ensure
                                                quality information. Assess learners' understanding of the
                                                details through quizzes.</li>

                                            <li><span class="event-icon-single"><i
                                                        class="icon-maps-and-flags4"></i></span> Lorem ipsum
                                                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                                sunt in culpa qui officia deserunt mollit anim id est laborum.
                                            </li>

                                            <li><span class="event-icon-single"><i
                                                        class="icon-maps-and-flags4"></i></span> Provide
                                                additional
                                                resources such as readings, articles, videos,
                                                or online tutorials for learners who want to explore the details
                                                further. Offer recommendations for reputable sources to ensure
                                                quality information. Assess learners' understanding of the
                                                details through quizzes.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="event-desc-area">
                            <h4>Event Description</h4>
                            <p>Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                deserunt mollit anim id est laborum.</p>

                            <div class="desc-map-area">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4216.433331900906!2d90.36996032419312!3d23.83718617432321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1693682874850!5m2!1sen!2sbd"></iframe>
                            </div>
                        </div>

                        <div class="event-member-area">
                            <h4>Participants</h4>


                            <div class="row">
                                <!-- Single member -->
                                <div class="col-sm-6 col-lg-4">
                                    <div class="team-block">
                                        <div class="single-team-card relative wow fadeInUp" data-wow-delay="500ms">
                                            <!-- Border shape -->
                                            <div class="border-s-1"></div>
                                            <div class="border-s-2"></div>
                                            <div class="border-s-3"></div>
                                            <div class="border-s-4"></div>
                                            <div class="border-s-5"></div>
                                            <!-- img -->
                                            <div class="team-img relative">
                                                <img class="relative" src="img/bg-img/t-1.jpg" alt="">
        
                                                <!-- content text -->
                                                <div class="member-info text-center">
                                                    <h3>Jessica jhon</h3>
                                                    <p>Nursing Staff</p>
                                                </div>
        
                                                <div class="contact-social-icon">
                                                    <div class="share-icon-area">
                                                        <div class="share-icon"> <span
                                                                class="icon-share-alt-solid-1 share--icon"></span>
                                                            <div class="conatct-icon-">
                                                                <ul>
                                                                    <li><a href="#"><span class="icon-facebook-f"></span></a>
                                                                    </li>
                                                                    <li><a href="#"><span class="icon-linkedin-in"></span></a>
                                                                    </li>
                                                                    <li><a href="#"><span class="icon-twitter"></span></a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
        
                                                    </div>
        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
        
                                </div>
        
                                <!-- Single member -->
                                <div class="col-sm-6 col-lg-4">
                                    <div class="team-block wow fadeInUp" data-wow-delay="700ms">
                                        <div class="single-team-card relative">
                                            <!-- Border shape -->
                                            <div class="border-s-1"></div>
                                            <div class="border-s-2"></div>
                                            <div class="border-s-3"></div>
                                            <div class="border-s-4"></div>
                                            <div class="border-s-5"></div>
                                            <!-- img -->
                                            <div class="team-img relative">
                                                <img class="relative" src="img/bg-img/t-3.jpg" alt="">
        
                                                <!-- content text -->
                                                <div class="member-info text-center">
                                                    <h3>jhon Brown</h3>
                                                    <p>Nursing</p>
                                                </div>
        
                                                <div class="contact-social-icon">
                                                    <div class="share-icon-area">
                                                        <div class="share-icon"> <span
                                                                class="icon-share-alt-solid-1 share--icon"></span>
                                                            <div class="conatct-icon-">
                                                                <ul>
                                                                    <li><a href="#"><span class="icon-facebook-f"></span></a>
                                                                    </li>
                                                                    <li><a href="#"><span class="icon-linkedin-in"></span></a>
                                                                    </li>
                                                                    <li><a href="#"><span class="icon-twitter"></span></a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
        
                                                    </div>
        
                                                </div>
                                            </div>
        
                                        </div>
                                    </div>
        
                                </div>
        
                                <!-- Single member -->
                                <div class="col-sm-6 col-lg-4">
                                    <div class="team-block wow fadeInUp" data-wow-delay="900ms">
                                        <div class="single-team-card relative">
                                            <!-- Border shape -->
                                            <div class="border-s-1"></div>
                                            <div class="border-s-2"></div>
                                            <div class="border-s-3"></div>
                                            <div class="border-s-4"></div>
                                            <div class="border-s-5"></div>
                                            <!-- img -->
                                            <div class="team-img relative">
                                                <img class="relative" src="img/bg-img/t-2.jpg" alt="">
        
                                                <!-- content text -->
                                                <div class="member-info text-center">
                                                    <h3>Jessica</h3>
                                                    <p>Nursing Staff</p>
                                                </div>
        
                                                <div class="contact-social-icon">
                                                    <div class="share-icon-area">
                                                        <div class="share-icon"> <span
                                                                class="icon-share-alt-solid-1 share--icon"></span>
                                                            <div class="conatct-icon-">
                                                                <ul>
                                                                    <li><a href="#"><span class="icon-facebook-f"></span></a>
                                                                    </li>
                                                                    <li><a href="#"><span class="icon-linkedin-in"></span></a>
                                                                    </li>
                                                                    <li><a href="#"><span class="icon-twitter"></span></a></li>
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
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="sidebar-content-single-area">
                        <div class="side-bar-video-area">
                            <div class="how-it-work-content-3 relative">
                                <div class="side-video-img relative">
                                    <img src="img/bg-img/home-3/how.png" alt="">
                                </div>

                               
                            </div>

                            <div class="enroll-course-content">
                                <div class="enroll-heading text-center">
                                    <a class="auth-btn w-100" href="#">Enroll Course</a>
                                    <p>30-Day Money-Back Guarantee</p>
                                </div>

                                <ul class="course-info-list event">
                                    <li>Start Date : <span>0</span></li>
                                    <li>Start Time : <span>80 hrs30 mins</span></li>
                                    <li>Date : <span>100</span></li>
                                    <li>End Time : <span>6:30</span></li>
                                    <li>Skill Level : <span>Yes</span></li>
                                    <li>Location : <span>USA</span></li>
                                    <li>Certificate : <span>Yes</span></li>
                                </ul>

                                <div class="course-share-icon-area">
                                    <p>Share :</p>
                                    <ul class="course-share-icon">
                                        <li><a href="#"><i class="icon-facebook-f"></i></a></li>
                                        <li><a href="#"><i class="icon-instagram"></i></a></li>
                                        <li><a href="#"><i class="icon-linkedin-in"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection