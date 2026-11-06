@php
$coursecategoryLists = App\Http\Controllers\Common::coursecategory();
$setting = Common::setting();
@endphp
 <!-- Footer -->
 <footer class="footer-wrap bg--dark">
                <!-- Shape -->
                <div class="f-shape-1 wow fadeInUp" data-wow-delay="900ms">
                    <img src="{{asset('img/bg-img/f-shap-1.png')}}" alt="">
                </div>
                <!-- Shape -->
                <div class="f-shape-2 wow fadeInRight" data-wow-delay="700ms">
                    <img src="{{asset('img/bg-img/f-shap-2.png')}}" alt="">
                </div>
                <!-- Shape -->
                <div class="f-shape-3 wow fadeInRight" data-wow-delay="500ms">
                    <img src="{{asset('img/bg-img/f-shape-3.png')}}" alt="">
                </div>
                <div class="footer-content">
                    <div class="container">
                        <div class="row justify-content-between">
                            <div class="col-12 col-sm-6 col-lg-3">
                                <div class="me-4"> 
                                    @if(!empty($setting->logo))
                                    <a class="mb-4 d-block footer-logo" href="#">
                                        <img src="{{url('generalsettings/'.$setting->logo)}}" alt="">
                                    </a>
                                    @endif

                                    <p class="footer-desc"></p>

                                    <div class="footer-contact-info wow fadeInLeft" data-wow-delay="700ms">
                                        <ul>
                                            <li><a href="{{$setting->facebook??'--'}}"><span class="icon-facebook-f"></span></a></li>
                                            <li><a href="{{$setting->twitter??'--'}}"><span class="icon-twitter"></span></a></li>
                                            <li><a href="{{$setting->linkedin??'--'}}"><span class="icon-linkedin-in"></span></a></li>
                                            <li><a href="{{$setting->instagram??'--'}}"><span class="icon-instagram"></span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 col-sm-6 col-lg-2">
                                <div class="quick-links-nav">
                                    <h5 class="mb-3 text-white">Categories</h5>
                                    <span class="footer-shape-1"></span>
                                    <span class="footer-shape-2"></span>
                                    <ul>
                                    @if(!empty($coursecategoryLists) && count($coursecategoryLists)>0)
                                    @foreach($coursecategoryLists as $list)
                                    <li><a href="{{url('course/'.$list->id.'/'.$list->slug)}}">{{$list->title}}</a></li>
                                    @endforeach
                                    @endif
                                       
                                    </ul> 
                                </div>
                            </div>

                            <div class="col-12 col-sm-6 col-lg-2">
                                <div class="quick-links-nav">
                                    <h5 class="mb-3 text-white">Links</h5>
                                    <ul>
                                        <li><a href="{{url('about')}}">About Us</a></li>
                                        <li><a href="{{url('faq')}}">Faq</a></li>
                                        <li><a href="{{url('team')}}">Teachers</a></li>
                                        <li><a href="{{url('eventgallery')}}">Gallery</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div class="col-12 col-sm-6 col-lg-3">
                                <div class="quick-contact-nav">
                                    <h5 class="mb-3 text-white">Contact</h5>
                                    <span class="footer-shape-1"></span>
                                    <span class="footer-shape-2"></span>
                                    <ul>
                                        <li> 
                                            <p><span class="icon-incoming-call"></span>{{$setting->mobile??'--'}}</p>
                                        </li>
                                        <li>
                                            <p><span class="icon-email"></span> {{$setting->email}}</p>
                                        </li>
                                        <li>
                                            <p><span class="icon-map"></span> {{$setting->address}}</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="copy-right-area">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="copy-right-text text-center wow fadeInDown" data-wow-delay="900ms">
                                    <p class="mb-0"> © Copyright {{ date('Y') }} by <a href="#">{{$setting->name}}</a></p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </footer>