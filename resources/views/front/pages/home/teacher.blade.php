@php
   $teacherlists = App\Http\Controllers\Common::teachers();
   $setting = Common::setting();
   @endphp 
   <div class="popular-cata-area relative">
                <div class="map-img wow fadeInLeft" data-wow-delay="500ms">
                    <img src="{{asset('front/img/bg-img/map.png')}}" alt="">
                </div>
                <div class="container">
                    <div class="row justify-content-center">
                        <!-- title -->
                        <div class="col-md-8 col-lg-7">
                            <div class="section-title-area text-center wow fadeInRight" data-wow-delay="500ms">
                                <h6>Teachers</h6>
                                <h2 class="mb-0">Meet your teachers online!</h2>
                            </div>
                        </div>
                    </div>

                    <div class="row"> 
                        <!-- Single Card -->
                        <!-- Single member -->
                        @if(!empty($teacherlists) && count($teacherlists)>0)
                    @foreach($teacherlists as $list)
                    <!-- Single member -->
                    <div class="col-md-6 col-xl-3 mb-5">
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
                                            @if(!empty($list->user->image))
                                            <img class="relative" src="{{url('user/'.$list->user->image)}}" width="300" height="280"alt="">
                                            @else
                                            <img src="{{asset('front/img/noprofileimage.png')}}" height="270" alt="">
                                            @endif
                                                <!-- content text -->
                                                <div class="member-info text-center">
                                                    <h3>{{$list->user->name??'--'}}</h3>
                                                    <p>{{$list->qualificationname->name??'--'}}</p>
                                                </div>

                                                <div class="contact-social-icon">
                                                    <div class="share-icon-area">
                                                        <div class="share-icon"> <span class="icon-share-alt-solid-1 share--icon"></span>
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
                @endforeach
                    @endif
                    </div>
                    </div>
                </div>
            <!-- Team Area -->