@extends('front.layouts.layouts')
@section('title',$course_details->name??'')
@section('content')
@if(!empty($course_details->id))  
@php $tmode = Common::getTeachMode($course_details->teaching_mode); @endphp
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img" style="background-image: url({{asset('img/bg-img/home-3/bg.png')}});">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="#">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>{{$course_details->name??''}}</li>
                        </ul> 
                        <h4 class="mb-0">{{$course_details->name??''}}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="course-details-area mt-0">
        <div class="container">
            <div class="row">
                <div class="col-lg-8">
                <div class="course-details-content-area">
                <div class="course-heading-details">
                                    <div class="course-title">
                                        <h2>{{$course_details->name??''}}</h2>
                                        @if(!empty($course_details->price))<a class="inner-btn">Rs {{$course_details->price??''}}</a>@endif
                                    </div>

                                    <div class="course-info-card-area">
                                        <!-- Card -->
                                        <div class="course-info-card">
                                            <h4> Instructor:</h4>
                                            <div class="course-auth-info-4 d-flex align-items-center"> 
                                                <img class="auth-img" src="{{url('user/thumbnail/'.$course_details->teacher->image)}}" alt="">
                                                <p>By <a href="#">{{$course_details->teacher->name??''}}</a></p>
                                            </div>
                                        </div>

                                        <!-- Card -->
                                        <div class="course-info-card">
                                            <h4>Reviews:</h4>
                                            <p class="course-rating mb-0">{!!Common::courseRating($course_details->id)!!} <span>({{Common::feedbackcount($course_details->id)}})</span></p>
                                        </div>

                                        <!-- Card -->
                                        <div class="course-info-card">
                                            <h4>Enrolled:</h4>
                                            <p class="course-desc"> ({{Common::enrollcount($course_details->id)}}) Students</p>
                                        </div>

                                        <!-- Card -->
                                        <div class="course-info-card">
                                            <h4>Categories:</h4>
                                            <p class="course-desc"> {{$course_details->category->title??''}}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="course-bg-img mt-0">
                                    <img src="{{url('course/'.$course_details->image)}}" width="800" alt="">
                                </div>

                                <div class="blog-details-card-area">
                                    

                                    <div class="blog-details-desc">
                                        {!!$course_details->description??''!!}
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
                                                <p>{!!$list->feedback!!}</p>

                                                    <p>{{date('dS F Y ', strtotime($list->created_at))}} <br> 
                                                    {{date('H:i a', strtotime($list->created_at))}} </p> 

                                            </div>
                                        </div>
                                    </div>
                                    @endforeach
                                    @endif

                                    

                                    <div class="comment-box-area">
                                        <h4>Leave a Feedback</h4>
                                        <p>(Your email address will not be published. Required fields are marked *)</p>

                                        <div class="row">
                                          <input type="hidden" id="course_id" value="{{Request()->courseid}}">
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
                                                    <textarea class="form-control" placeholder="Your Feedback" id="feedback" name="feedback"></textarea>
                                                    <label class="lable-text" for="feedback">Write your feedback here...</label>
                                                </div>
                                            </div>

                                            <div class="col-12">
                                                <button type="button" id="postfeedback" class="auth-btn post">Post Comment</button>
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
                                    <img src="{{url('course/'.$course_details->image)}}" height="200" width="500" alt="course_img">
                                </div>

                                <div class="play-btn course">
                                    <div class="video_player_btn">
                                        <a href="#" 
                                            class="popup-video coursevideomodal"><span class="icon-Polygon-1"></span></a>
                                    </div>
                                </div>
                            </div>
 
                            <div class="enroll-course-content">
                                <div class="enroll-heading text-center">                                    
                                {!!Common::checkenroll($course_details->id)!!}
                                </div>

                                <ul class="course-info-list">
                                    <li>Duration : <span>{!!($course_details->duration)!!} Months</span></li>
                                    <li>Teaching Mode : <span>{!!($tmode)!!}</span></li>
                                    <li>Price  : <span>Rs. {{$course_details->price}}</span></li>
                                </ul>
                            </div>
                        </div>


                        <!-- Single Card --> 
                            @if(!empty($coursecategories) && count($coursecategories)>0)
                                <div class="cate-single-card">
                                    <div class="cate-content-card">
                                        <h3>All Courses</h3>

                                        <ul class="cate-list">
                                            @foreach($coursecategories as $list)
                                            <li><a href="{{route('front.course_list',[$list->id,$list->slug])}}"><i class="icon-right ml-1"></i> {{$list->title??'--'}}</a>
                                                <span>{{$list->courses_count}}</span>
                                            </li>   
                                            @endforeach                                         
                                        </ul>
                                    </div>
                                </div>
                            @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endif
     
<div class="modal fadex mt-50" id="coursevideomodal"  tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Demo Video for {{$course_details->name}}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <iframe src="https://www.youtube.com/embed/{{Common::getutubeid($course_details->youtube_url)}}?si=oY_bkdHwvbPl-rSB" width="100%" height="300" frameborder="1"></iframe>
      </div>
    </div>
  </div>
</div>
@endsection