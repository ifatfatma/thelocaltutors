<!-- Counter up area -->
<div class="counter-upaarea-2">
                <!-- Shape -->
                <div class="counter-shape-2">
                    <img src="{{asset('front/img/bg-img/c-shape-2.png')}}" alt="">
                </div>

                <!-- Shape -->
                <div class="counter-shape-3">
                    <img src="{{asset('front/img/bg-img/counter-shape.png')}}" alt="">
                </div>

                <div class="container">
                    <div class="row">
                        <!-- Single card -->
                        <div class="col-sm-6 col-lg-3">
                            <div class="single-counter-2-card d-flex align-items-center wow fadeInRight"
                                data-wow-delay="500ms">
                                <!-- icon -->
                                <div class="counter-2-icon">
                                    <span class="icon-book-solid-11"></span>
                                </div>
                                <!-- text -->
                                <div class="counter-2-text">
                                    <h2><span class="">{{Common::coursecount()}}</span></h2>
                                    <p>Total Courses</p>
                                </div>
                            </div>
                        </div>

                        <!-- Single card -->
                        <div class="col-sm-6 col-lg-3">
                            <div class="single-counter-2-card d-flex align-items-center wow fadeInRight"
                                data-wow-delay="700ms">
                                <!-- icon -->
                                <div class="counter-2-icon">
                                    <span class="icon-ruler-combined-solid-1"></span>
                                </div>
                                <!-- text -->
                                <div class="counter-2-text">
                                    <h2><span class="">{{Common::teacherscount()}}</span></h2>
                                    <p>Total Teachers</p>
                                </div>
                            </div>
                        </div>

                        <!-- Single card -->
                        <div class="col-sm-6 col-lg-3">
                            <div class="single-counter-2-card d-flex align-items-center wow fadeInRight"
                                data-wow-delay="900ms">
                                <!-- icon -->
                                <div class="counter-2-icon">
                                    <span class="icon-ruler-combined-solid-1"></span>
                                </div>
                                <!-- text -->
                                <div class="counter-2-text">
                                    <h2><span class="">{{Common::enrollcoursecount()}}</span></h2>
                                    <p>Enrolled Students</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Counter up area -->