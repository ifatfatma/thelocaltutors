
            <!-- Knowledge CTA Area -->
            <div class="knowledge-cta-area relative">
                <!-- Shape -->
                <div class="cta-shape wow fadeInRight" data-wow-delay="1400ms">
                    <img src="{{asset('front/img/bg-img/c-shape-1.png')}}" alt="">
                </div>

                <!-- Content and image -->
                <div class="knowledge-cta-content-img">
                    <div class="knowledge-cta-img"> 
                        <img src="{{asset('front/img/bg-img/c-1.png')}}" alt="">
                    </div>
                    <div class="knowledge-cta-text wow fadeInRight" data-wow-delay="500ms">
                        <h3>{{$pageData->title}}</h3>
                        <p>{!!$pageData->description!!}</p>
                       
                        <a class="btn-1" href="{{url('register')}}">Become a Mentor <span class="icon-right-arrow-11"></span></a>
                    </div>
                </div>
            </div>
            <!-- Knowledge CTA Area -->