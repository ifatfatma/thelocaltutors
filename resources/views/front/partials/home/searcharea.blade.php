<!-- Hero Area -->
<div class="hero-area" id="hero">
                <div class="shape-1 shake-ani">
                    <img src="{{asset('front/img/bg-img/light.png')}}" alt="">
                </div>
                <div class="wel-shape-7 round-ani">
                    <img src="{{asset('front/img/bg-img/shape-1.png')}}" alt="">
                </div>

                <div class="wel-shape-6">
                    <img src="{{asset('front/img/bg-img/shape-5.png')}}" alt="">
                </div>

                <div class="container h-100">
                    <div class="row h-100 align-items-center justify-content-between">
                        <div class="col-lg-7">
                            <!-- Content text -->
                            <div class="hero-content-text">
                                <h3 class="wow fadeInRight" data-wow-delay="900ms">What are you looking for?</h3>
                                <p class="wow fadeInRight" data-wow-delay="1100ms">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <select class="form-select mt-1">
                                                <option>Looking For?</option>
                                                @php
                                                    $tmode = !empty($teacher->teaching_mode)?$teacher->teaching_mode:''; 
                                                    $tmodeexplode = [];
                                                    if(!empty($tmode)){
                                                    $tmodeexplode = explode(",",$tmode);
                                                    }
                                                    @endphp
                                                {!!Common::getCustomDropDown('teachmode',$tmodeexplode,'array')!!}
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
                            </div>
                        </div>
                    </div>
                    <!-- Image -->
                    <div class="hero-img-area">
                        <div class="hero-img-user wow fadeInUp" data-wow-delay=".9s"> <img class="relative"
                                src="img/bg-img/wel-1.png" alt="">
                        </div>

                        <!-- Shape round -->
                        <div class="wel-shape-2 wow fadeInUp" data-wow-delay="1.2s">
                            <img src="img/bg-img/shape-6.png" alt="">
                        </div>

                        <div class="wel-shape-3 wow fadeIn" data-wow-delay="1.8s">
                            <img src="img/bg-img/shape-2.png" alt="">
                        </div>
                        <div class="wel-shape-4">
                            <img src="img/bg-img/shape-3.png" alt="">
                        </div>
                        <div class="wel-shape-5">
                            <img src="img/bg-img/shape-4.png" alt="">
                        </div>

                        <div class="wel-shape-course-title">
                            <div class="course-shape relative">
                                <img src="img/bg-img/shape-13.png" alt="">
                                <div class="shape-title-course">
                                    <p>120+ Courses</p>
                                </div>
                            </div>
 

                        </div>
                    </div>
                </div>
            </div>