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
                        <h4>Frequently asked some questions?</h4>
                        <div class="accordion" id="accordionExample">
                            
                        @if(!empty($faqlist) && count($faqlist)>0)
                        @foreach($faqlist as $key=>$list)
                        <div class="accordion-item wow fadeInUp" data-wow-delay="900ms">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#collapseTwo"
                                        aria-expanded="false" aria-controls="collapseTwo">
                                        2. Do you offer any extracurricular activities for the students?
                                    </button>
                                </h2>
                                <div id="collapseTwo" class="accordion-collapse collapse"
                                    data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <p>"Edumastery has been an amazing experience for our daughter, Lily.
                                            The
                                            inclusive and enriching atmosphere has not only helped her academic
                                            growth
                                            but has also fostered her social and emotional development. We are
                                            grateful
                                            for the caring and dedicated staff."</p>
                                    </div>
                                </div>
                            </div>


                            
                            <div class="accordion-item  wow fadeInUp" data-wow-delay="700ms">
                                <h2 class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne" aria-expanded="true"
                                        aria-controls="collapseOne">
                                        
                                    </button>
                                </h2>
                                <div id="collapseOne" class="accordion-collapse collapse show"
                                    data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <p>{!!$list->description!!}</p>
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

    <!-- Contact us area -->
    <div class="contact-us-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <div class="contact-img">
                        <img src="img/bg-img/inner/contact.png" alt="">
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="conatct-content-area">
                        <div class="section-title-area">
                            <h6>Contact</h6>
                            <h2 class="mb-0">Get a Free Course You Can Contact With Me</h2>

                            <div class="form-floating mb-5">
                                <input type="text" class="form-control" id="floatingInput1"
                                    placeholder="Name">
                                <label class="lable-text" for="floatingInput1">Name</label>
                            </div>

                            <div class="form-floating mb-5">
                                <input type="email" class="form-control" id="floatingInput2"
                                    placeholder="Email">
                                <label class="lable-text" for="floatingInput2">Email</label>
                            </div>

                            <div class="form-floating mb-5">
                                <input type="number" class="form-control" id="floatingInput3"
                                    placeholder="Phone">
                                <label class="lable-text" for="floatingInput3">Phone</label>
                            </div>


                            <div class="form-floating mb-5">
                                <textarea class="form-control" placeholder="Message" id="floatingTextarea"></textarea>
                                <label class="lable-text" for="floatingTextarea">Message</label>
                                </div>

                            <button type="submit" class="auth-btn w-100">Send Message</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Contact us area -->
@endsection