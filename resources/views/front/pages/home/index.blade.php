@extends('front.layouts.layouts')

@section('content')

<!-- Hero Area -->
 
<div class="hero-area" id="hero">
                <div class="shape-1 shake-ani">
                    <img src="{{asset('front/img/bg-img/light.png')}}" alt="">
                </div>
                <div class="wel-shape-7 round-ani">
                    <img src="{{asset('front/img/bg-img/shape-1.png')}}" alt="">
                </div>

                <div class="wel-shape-6">
                    <img src="{{asset('front/img/bg-img/shape-5.png')}}" alt="">
                </div>

            @include('front.pages.home.search')   
            @include('front.pages.home.image')
            @include('front.pages.home.popularcourses')<br>
            @include('front.pages.home.counter')<br>
            @include('front.pages.home.becomeamentor')
            @include('front.pages.home.blog')

</div>
@endsection