@php
   $bloglist = App\Http\Controllers\Common::blogs();
   $setting = Common::setting();
   @endphp 
<!-- Blog Area -->
<div class="blog-area">
                <div class="container">
                    <div class="row justify-content-center">
                        <!-- title -->
                        <div class="col-md-8 col-lg-7">
                            <div class="section-title-area text-center wow fadeInRight" data-wow-delay="500ms">
                                <h6>Latest Article Blog</h6>
                                <h2 class="mb-0">Our latest news & upcoming blog</h2>
                            </div> 
                        </div>
                    </div>

                    <div class="row ">
                        <!-- Single Card -->
                        @if(!empty($bloglist) && count($bloglist)>0)
                        @foreach($bloglist as $list)
                        <div class="col-md-6 col-xl-4 mb-3">
                            <div class="single-blog-artical relative">
                                <div class="single-blog-card relative">
                                    <div class="deft-blog-content-info relative">
                                        <!-- img -->
                                        <div class="blog-img relative">
                                            <img class="relative" src="{{url('blog_cover_image/'.$list->blog_cover_image)}}" height="500"  alt="">
                                        </div>

                                        <!-- Content -->
                                        <div class="blog-content-text text-center">
                                            <!-- badge -->
                                            <div class="date-badge">
                                                <div class="wow fadeInLeft" data-wow-delay="500ms">
                                                    <h6>{{date('dS F Y', strtotime($list->date))}}</h6>
                                                </div>
                                            </div>
                                            <div class="blog-header d-flex justify-content-center">
                                                <p><span class="icon-user-2"></span> {{$list->blog_by}}</p>
                                                <p><span class="icon-chat-bubble"></span> {{Common::blogsfeedbackcount($list->id)}} comment(s)</p>
                                            </div>
                                            <h3><a href="{{url('blog_details/'.$list->id)}}">{{$list->title}}</a></h3>
                                        </div>
                                    </div>
                                    <!-- Hover Content -->
                                    <div class="hover-blog-content-img text-center">
                                        <div class="b-shape-img">
                                            <div class="date-badge">
                                                <div>
                                                    <h6>{{date('dS F Y', strtotime($list->date))}}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="hover-blog-content">
                                            <div class="blog-header d-flex justify-content-center">
                                                <p><span class="icon-user-2"></span> {{$list->blog_by}}</p>
                                                <p><span class="icon-chat-bubble"></span> {{Common::blogsfeedbackcount($list->id)}} comment(s)</p>
                                            </div>
                                            <h3><a href="{{url('blog_details/'.$list->id)}}">{{$list->title}}</a></h3>
                                            <p>{!!$list->short_description!!}</p>
                                        </div>
                                    </div>

                                </div>
                                <!-- Btn -->
                                <div class="blog-btn-area">
                                    <a class="blog-btn" href="{{url('blog_details/'.$list->id)}}"><span
                                            class="icon-right-arrow"></span></a>
                                </div>
                            </div>
                        </div>
                        @endforeach
                        @endif
                        <div>
                        <a class="btn-1 float-end" href="{{url('blogs')}}">View All Blogs <span class="icon-right-arrow-11"></span></a>
                        </div>
                    </div>
                </div>
            <!-- Blog Area --> 