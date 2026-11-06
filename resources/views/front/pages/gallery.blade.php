@extends('front.layouts.layouts')
@section('content')
@php
$gallerylist = App\Http\Controllers\Common::gallery();
@endphp 
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url(img/bg-img/home-3/bg.png);">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="{{url('index')}}">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>Gallery</li>
                        </ul>
                        <h4 class="mb-0">Gallery</h4>
                    </div> 
                </div>
            </div>
        </div>
    </div>

    <!-- Portfolio Area -->
    <div class="portfolio-area single-page-gallery">
    <div class="container">
        <div class="row g-4 g-lg-5 gallery-area">
            <!-- Card -->
            @if(!empty($gallerylist) && count($gallerylist)>0)
            @foreach($gallerylist as $list)
            <div class="col-12 col-sm-6 col-lg-3">
                <div class="portfolio-card">
                    <div class="portfolio-image  wow fadeInUp" data-wow-duration="1000ms"
                        data-wow-delay="200ms">
                        <img src="{{url('gallery/'.$list->gallery_image)}}" height="300" alt="">

                        <!-- Overlay Content -->
                        <div class="overlay-content d-flex align-items-center justify-content-center">
                            <div class="text-center">
                                <span style="color:#ffffff;">{{$list->title}}</span> 
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
<!-- Portfolio Area -->
@endsection 