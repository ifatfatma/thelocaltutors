
@extends('front.layouts.layouts')

@section('content')
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url({{asset('img/bg-img/home-3/bg.png')}});">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="#">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>{{$blogdetails->title}}</li>
                        </ul>
                        <h4 class="mb-0">{{$blogdetails->title}}</h4>
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
                                    <img src="{{url('blog/'.$blogdetails->blog_image)}}" width="800" alt="">
                                </div>

                                <div class="blog-details-header d-flex align-items-center">
                                    <p><i class="icon-user-2"></i> {{$blogdetails->blog_by}}</p>
                                    <p><i class="icon-chat-bubble"></i> {{Common::blogsfeedbackcount($blogdetails->id)}} comments</p> 
                                    <p><i class="icon-clock-solid-1"></i>{{date('d-M-Y', strtotime($blogdetails->created_at))}}</p>
                                </div>

                                <div class="blog-details-card-area">
                                            <div class="blog-details-desc">
                                                <h4>{{$blogdetails->title}}</h4>
                                                {!!$blogdetails->description!!}
                                            </div>
                                        
                                            <!-- Feedback --> 
                                            @if(!empty($feedbacklist) && count($feedbacklist)>0)  
                                            @foreach($feedbacklist as $key=>$list)
                                            <div class="feedback-card-area">
                                                <div class="feedback-card-img-content">
                                                    <div class="feedback-img">
                                                        @if(!empty($list->user->image))
                                                        <img src="{{url('user/thumbnail/'.$list->user->image)}}" alt="">
                                                        @else
                                                        <img src="{{asset('front/img/noprofileimage.png')}}" alt="">

                                                        @endif
                                                    </div>
                                                    <div class="feedback-content-text">
                                                            <div class="feedback-header">
                                                            <h4>{{$list->user->name??''}}</h4>
                                                        </div>
                                                        <p>{!!$list->blogfeedback!!}</p>

                                                        <p>{{date('dS M Y ', strtotime($list->created_at))}} <br> 
                                                            <small>{{date('H:i a', strtotime($list->created_at))}} </small></p> 

                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            @endforeach
                                            @endif

                                            <div class="comment-box-area">
                                                <h4>Leave a Feedback</h4>
                                                <p>Your email address will not be published. Required fields are marked *</p>

                                                <div class="row">
                                                    <input type="hidden" id="blog_id" value="{{Request()->blogid}}">
                                                    <div class="col-12">
                                                        <div class="form-floating mb-5">
                                                            <select class="form-control" id="rating" name="rating">
                                                                <option value="5">Very Excellent</option>
                                                                <option value="4">Excellent</option>
                                                                <option value="3">Very Good</option>
                                                                <option value="2">Good</option>
                                                                <option value="1">Poor</option>
                                                            </select>
                                                            <label class="lable-text"  for="rating">Ratings</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-12">
                                                        <div class="form-floating">
                                                            <textarea class="form-control" placeholder="Your Feedback" id="blogfeedback" name="blogfeedback"></textarea>
                                                            <label class="lable-text" for="feedback">Write your feedback here...</label>
                                                        </div>
                                                    </div>

                                                    <div class="col-12">
                                                        <button type="button" id="postblogfeedback" class="auth-btn post">Post Comment</button>
                                                    </div>
                                                </div>
                                            </div>
                                    </div> 
                            </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="sidebar-content-single-area">
                                <!-- News Card -->
                            <div class="cate-single-card">
                                <div class="cate-content-card">
                                    <h3>Latest News </h3>
                                    <!-- Single news -->

                                    @foreach($bloglist as $list)                                
                                    <div class="news-cate-area d-flex align-items-center">
                                        <div class="news-img">
                                            <img src="{{url('blog_cover_image/'.$list->blog_cover_image)}}" alt="">
                                        </div>
                                        <div class="news-content-text"> 
                                            <h6><a href="{{url('blog_details/'.$list->id)}}">{{$list->title}}</a></h6>
                                            <p><i class="icon-clock-solid-1"></i>{{date('d-M-Y', strtotime($list->created_at))}} </p>
                                        </div>
                                    </div>
                                    @endforeach 
                                </div>
                            </div>
                            
                        </div>
                    </div>
            </div>
        </div>
    </div>

@endsection