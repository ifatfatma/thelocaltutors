@extends('front.layouts.layouts')
@section('content')

    <div class="breadcrumb-area relative">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li>Home</li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>Courses</li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>My Favourite Courses</li>
                        </ul>
                        <h4>My Favourite Courses</h4>
                    </div>
                </div>
            </div>
        </div>
        <!-- Filter Search -->
        <div class="grid-filter-area relative">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        {{--<!-- Filter -->
                        <div class="grid-filter-search relative d-flex align-items-center justify-content-between">
                            <div class="grid-filter-btn d-flex align-items-center">
                                
                            </div>
                            <button class="filter-btn toggle-btn" onclick="toggleBox()"><i class="icon-mdi_filter-outline"></i>
                                <span>Filter</span></button>
                        </div>--}}

                        
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="searc-filed-cart-area" id="box">
                    <div class="search-filter-box">
                        <div class="single-filter-card">
                            <label for="ratingName" class="form-label">Short By Rating</label>
                            <input type="text" class="form-control" id="ratingName" placeholder="Rating"
                                value="" required="">
                        </div>
                        <div class="single-filter-card">
                            <label for="orderName" class="form-label">Short By Order</label>
                            <input type="text" class="form-control" id="orderName" placeholder="Default"
                                value="" required="">
                        </div>
                        <div class="single-filter-card">
                            <label for="authroName" class="form-label">Short By Author</label>
                            <input type="text" class="form-control" id="authroName" placeholder="Nothing selected"
                                value="" required="">
                        </div>
                        <div class="single-filter-card">
                            <label for="priceName" class="form-label">Short By Price</label>
                            <input type="text" class="form-control" id="priceName" placeholder="All"
                                value="" required=""> 
                        </div>
                        <div class="single-filter-card">
                            <label for="categor" class="form-label">Short By Category</label>
                            <input type="text" class="form-control" id="categor" placeholder="Nothing selected" value=""
                                required="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Featured Course Area -->
    <div class="featured-course-4-area single-page">
        <div class="container"> 
            <div class="row">
            @if(!empty($myfavcourselist) && count($myfavcourselist)>0)  
            @foreach($myfavcourselist as $key=>$list)
            @php $tmode = Common::getTeachMode($list->course->teaching_mode); @endphp
            @php $isFav = Common::getFavStatus($list->course->id); @endphp 
                <!-- Single Card -->
                <div class="col-12">
                    <div class="course-card-4-area course-list d-flex ">
                        <div class="course-img-4 single">
                            <div class="cr-img relative">
                            <a href="{{url('course_details/'.$list->course->id.'/'.$list->course->slug)}}"><img class="auth-img" src="{{asset('course/'.$list->course->image)}}"  alt="course"></a>

                                <div class="course-offer-4">
                                    <div class="offer-bg-shape relative">
                                        <img src="{{asset('img/bg-img/home-4/shape-4.png')}}" height="40" alt="">
                                    </div>
                                </div>
                            </div>  
                        </div>
 
                        <!-- Content -->
                        <div class="course-content-info-4 single">
                            <div
                                class="course-content-rating d-flex justify-content-between align-items-center">
                                <p>{!!Common::courseRating($list->course->id)!!} <span>({{Common::feedbackcount($list->course->id)}} Reviews)</span></p>
                                <div class="ribbon-icon">
                                    <a  href="javascript:void(0);" class="myfavcourse @if(!empty($isFav)) favactive @endif" id="{{$list->course->id}}"><i class="icon-icon_ribbon_alt"></i></a>
                                </div>
                            </div>
                            <h2><a href="{{url('course_details/'.$list->course->id.'/'.$list->course->slug)}}">{{$list->course->name??''}}</a></h2>
                            <!-- info -->
                            <div class="course-info-meta-4 d-flex align-items-center">
                                <p><i class="icon-clock"></i><b>Duration:</b> {!!($list->course->duration??'--')!!} Months  |   <b> Mode: </b>{!!($tmode)!!}</p>
                            </div>

                            
                            <div class="auth-info-4 d-flex align-items-center">
                                <p>By <a href="#">{{$list->course->teacher->name??'--'}}</a></p>
                            </div>
                            <!-- Price & Cart -->
                            <div class="course-footer-4 d-flex align-items-center justify-content-between">
                                <div class="course-price">
                                    <p>Rs. {{$list->course->price??'--'}}</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach 
                <tr>
                    <td colspan="12">{{$myfavcourselist->links()}} </td>
                </tr>  
                @else
                <tr>
                    <td colspan="12">
                        <span class="text-danger">
                            <strong>No Record(s) Found!</strong>
                        </span>
                    </td>
                </tr>  
                @endif

            </div>
        </div>
    </div>
@endsection