@extends('front.layouts.layouts')
@section('content')
@php
$teacherlists = App\Http\Controllers\Common::teachers();
$setting = Common::setting();
@endphp 
        <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
            style="background-image: url(img/bg-img/home-3/bg.png);">
            <div class="container h-100">
                <div class="row h-100 align-items-center">
                    <div class="col-12">
                        <div class="breadcrumb-conetnt">
                            <ul class="bread-list">
                                <li><a href="#">Home</a></li>
                                <li><i class="icon-down-arrow-11"></i></li>
                                <li>Our Teachers
                                </li>
                            </ul>
                            <h4 class="mb-0">Our Teachers
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Area -->
        <div class="">
        <div class="container">
        <div class="row justify-content-center">
                        <!-- title -->
                        <div class="col-md-8 col-lg-7">
                            <div class="section-title-area text-center wow fadeInRight" data-wow-delay="500ms">
                                <h2 class="mt-5">Meet your teachers online!</h2>
                            </div>
                        </div>
                    </div>
            <div class="row"> 
                    @if(!empty($teacherlists) && count($teacherlists)>0)
                    @foreach($teacherlists as $list)
                    <!-- Single member -->
                    <div class="col-md-6 col-xl-3 mb-3">
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
                                <img class="relative" src="{{url('user/'.$list->user->image)}}" height="280" width="300"alt="">
 
                                <!-- content text -->
                                <a href="#" class="teamteacherdetails" id="{{$list->user->id}}"><div class="member-info text-center">
                                    <h3>{{$list->user->name??'--'}}</h3> 
                                    <p>{{$list->qualificationname->name??'--'}}</p>
                                </div></a>

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
 
    <div class="modal fadex " id="teamteacherModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog ">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Teacher Details</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <span id="teamtreacherxresponse"></span> 
      </div>
         
    </div>
  </div>
</div>
@endsection