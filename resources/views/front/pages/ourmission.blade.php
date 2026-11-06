@extends('front.layouts.layouts')
@section('title','mission')
@section('content')
@php
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url(img/bg-img/home-3/bg.png);">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="{{url('index')}}">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>Our Mission</li>
                        </ul>
                        <h4 class="mb-0">{{$pageData->title}}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container ">
        <div class="row">
            <div class="col-12">
                <h1 class="mt-20">{{$pageData->title}}</h1>
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
                        <div class="product-details-tab-content">
                            <p>{!!$pageData->description!!}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection 