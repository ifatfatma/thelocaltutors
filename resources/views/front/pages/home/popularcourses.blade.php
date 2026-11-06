@php
   $coursecategoryLists = App\Http\Controllers\Common::homecoursecategory();
   $setting = Common::setting();
   @endphp 
<!-- Popular Categories Area -->
<div class="popular-cata-area relative">
                <div class="map-img wow fadeInLeft" data-wow-delay="500ms">
                    <img src="{{asset('front/img/bg-img/map.png')}}" alt="">
                </div>
                <div class="container">
                    <div class="row justify-content-center">
                        <!-- title -->
                        <div class="col-md-8 col-lg-7">
                            <div class="section-title-area text-center wow fadeInRight" data-wow-delay="500ms">
                                <h6>Popular categories</h6>
                                <h2 class="mb-0">Providing online classes for remote learning </h2>
                            </div>
                        </div>
                    </div>

                    <div class="row"> 
                        <!-- Single Card -->
                        @if(!empty($coursecategoryLists) && count($coursecategoryLists)>0)
                        @foreach($coursecategoryLists as $list)
                        <div class="col-md-6 col-xl-3">
                            <div class="single-cate-card relative wow fadeInLeft" data-wow-delay="500ms">
                                <div class="single-cate-content relative text-center">
                                    <!-- shape -->
                                    <div class="cate-shape">
                                        <img src="{{asset('front/img/bg-img/shap-8.png')}}" alt="">
                                    </div>
                                    @if(!empty($list->image))
                                    <div>
                                    <a href="{{url('course/'.$list->id.'/'.$list->slug)}}"><img  src="{{url('coursecategory/'.$list->image)}}" height="120" alt="img"></a>
                                    </div>
                                    @else
                                    <div>
                                    <a href="{{url('course/'.$list->id.'/'.$list->slug)}}"><img src="{{asset('front/img/noimage.jpg')}}" height="120" alt=""></a>
                                    </div>
                                    @endif
                                    <!-- icon -->
                                   <!--  <div class="cate-icon bg--primary">
                                        <span class="icon-transform-square"></span>
                                    </div> -->
                                    <h4><a href="{{url('course/'.$list->id.'/'.$list->slug)}}">{{$list->title}}</a></h4>
                                </div>
                            </div>
                        </div>
                    @endforeach
                    @endif   
            </div>
            <!-- Popular Categories Area -->