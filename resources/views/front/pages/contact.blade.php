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
                            <li>Contact</li>
                        </ul>
                        <h4 class="mb-0">Contact</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Contact us area -->
    <div class="contact-us-area page-2">
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
                            <h2 class="mb-4">We're here to help! Drop your messages here!</h2>
                            <form enctype="multipart/form-data" name="contactusform" id="contactusform" action="#" method="post">
                                @csrf
                                @method("POST")
                                <div class="form-floating mb-5">
                                    <input type="text" class="form-control" id="name" name="name" placeholder="Name">
                                    <label class="lable-text" for="name">Name</label>
                                </div>

                                <div class="form-floating mb-5">
                                    <input type="email" class="form-control" id="email" name="email" placeholder="Email">
                                    <label class="lable-text" for="email">Email</label>
                                </div>

                                <div class="form-floating mb-5">
                                    <input type="text" class="form-control" id="phone" name="phone" placeholder="Phone">
                                    <label class="lable-text" for="phone">Phone</label>
                                </div>


                                <div class="form-floating mb-5">
                                    <textarea class="form-control" placeholder="Message" name="message" id="message"></textarea>
                                    <label class="lable-text" for="message">Message</label>
                                </div>

                                <button type="submit" class="auth-btn w-100">Send Message</button>
                            </form> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Contact us area -->

    <div class="contact-map relative">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="conatct-info-meta">
                        <!-- Single Card -->
                         <div class="col-lg-12">
                        <div class="contact-single-info-card">
                            <div class="contact-icon">
                                <i class="icon-phone-alt-solid-11"></i>
                            </div>
                            <h4>Contact Phone Number</h4>
                            <p>{{Common::setting()->mobile}}</p>
                        </div>
                        </div>
    
                        <!-- SIngle Card -->
                        <div class="col-lg-12">
                        <div class="contact-single-info-card">
                            <div class="contact-icon">
                                <i class="icon-mail"></i>
                            </div>
                            <h4>Our Email Address</h4>
                            <p>{{Common::setting()->email}}</p>
                        </div>
                        </div>
    
                        <!-- SIngle Card -->
                        <div class="col-lg-12">
                        <div class="contact-single-info-card">
                            <div class="contact-icon">
                                <i class="icon-Vec1tor"></i>
                            </div>
                            <h4>Our Location</h4>
                            <p>{{Common::setting()->address}}</p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4216.433331900906!2d90.36996032419312!3d23.83718617432321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1693682874850!5m2!1sen!2sbd"></iframe>
    </div>
@endsection