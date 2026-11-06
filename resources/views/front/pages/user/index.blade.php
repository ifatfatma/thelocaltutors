@extends('front.layouts.layouts')

@section('content')
    

    <!-- popular categories area -->
    <div class="popular-cate-2-area bg-img bg-overlay relative"
        style="background-image: url(img/bg-img/popular.png);">
        <div class="cate-2-shape wow fadeInRight" data-wow-delay="1200ms">
            <img src="img/bg-img/home-2/shape-6.png" alt="">
        </div>
        <div class="container">
            <div class="row">
                

                <div class="col-md-4 col-lg-4">
                   <a  href="./changepassword" style="color:#ffffff !important;">
                    <div class="cate-price-card wow fadeInUp mt-3" data-wow-delay="700ms">
                        <div class="cate-price-body text-center text-white">
                            
                               <h4 style="color:#ffffff !important;">Change Password</h4>
                            
                        </div>
                    </div>
                    </a>
                </div>

                <div class="col-md-4 col-lg-4">
                   <a  href="./editprofile" style="color:#ffffff !important;">
                    <div class="cate-price-card wow fadeInUp mt-3" data-wow-delay="700ms">
                        <div class="cate-price-body text-center text-white">
                            
                               <h4 style="color:#ffffff !important;">Edit Profile</h4>
                            
                        </div>
                    </div>
                    </a>
                </div>

                

                <div class="col-md-4 col-lg-4">
                <a  href="./searchhistory" style="color:#ffffff !important;">
                    <div class="cate-price-card wow fadeInUp mt-3" data-wow-delay="700ms">
                        <div class="cate-price-body text-center text-white">
                            
                               <h4 style="color:#ffffff !important;">Search History</h4>
                            
                        </div>
                    </div>
                    </a>
                </div>


            </div>
        </div>
    </div>
    <!-- popular categories area -->


    

@endsection