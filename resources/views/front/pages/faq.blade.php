@extends('front.layouts.layouts')

@section('content')
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url(img/bg-img/home-3/bg.png);">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="#">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>FAQ</li>
                        </ul>
                        <h4 class="mb-0">FAQ</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Faq Area -->
    <div class="faq-area">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="faq-content-area single-page-faq">
                        <h4>Frequently asked questions?</h4>
                        <div class="accordion" id="accordionExample">
                            @if(!empty($faqlist) && count($faqlist)>0)
                            @foreach($faqlist as $key=>$list)
                            <div class="accordion-item  wow fadeInUp" data-wow-delay="700ms">
                                <h2 class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne" aria-expanded="false"
                                        aria-controls="collapseOne">
                                        {{$list->title}}
                                    </button>
                                </h2>
                                <div id="collapseOne" class="accordion-collapse collapse show"
                                    data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                    {!!$list->description!!}
                                    </div>
                                </div>
                            </div>
                            @endforeach
                            @endif
                            

                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Faq Area -->

@endsection