
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="SupportHive">

    <!-- Title -->
    <title>Edumastery - Education & Online Courses HTML Theme</title>

    <!-- Favicon -->
    <link rel="icon" href="img/core-img/favicon.png">

    <!-- Stylesheet -->
    <link rel="stylesheet" href="./css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/animate.css">
    <link rel="stylesheet" href="./css/nice-select2.css">
    <link rel="stylesheet" href="./css/icomoom.css">
    <link rel="stylesheet" href="./css/owl.carousel.min.css">
    <link rel="stylesheet" href="./css/swiper.min.css">
    <link rel="stylesheet" href="scss/style.css">
 
</head>

<body>
    <!-- Preloader -->
    <div id="preloader-active">
        <div class="preloader d-flex align-items-center justify-content-center">
            <div class="preloader-inner position-relative">
                <div class="preloader-circle"></div>
                <div class="preloader-img pere-text">
                    <img src="img/core-img/favicon.png" alt>
                </div>
            </div>
        </div>
    </div>
<!-- Top Header -->
<div class="top-header four">
    <div class="container h-100">
        <div class="row h-100 align-items-center">
            <div class="col-12">
                <div class="top-header-4-content d-flex align-items-center justify-content-between">
                    <div class="header-4-dropdown d-flex align-items-center">
                        <div class="top-dropdown">
                            <button type="button" class="dropdown-toggle" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <i class="icon-mail"></i> <span class="d-sm-inline-block lan-btn"> E-Mail <i
                                        class="icon-down-arrow-1"></i></span>
                            </button>

                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">support@thelocaltutors.com</a></li>
                            </ul>
                        </div>
                    </div>
                   
                    <div class="cart-login--area-4 d-flex align-items-center">
                        
                                <div class="top-dropdown">
                                    <button type="button" class="dropdown-toggle" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i class="icon-user-tie-solid-1"></i> <span class="d-sm-inline-block lan-btn"><i
                                                class="icon-down-arrow-1"></i></span>
                                    </button>
    
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="changepassword.html">Change password</a></li>
                                        <li><a class="dropdown-item" href="editprofile.html">Edit Profile</a></li>
                                        <li><a class="dropdown-item" href="setting.html">Setting</a></li>
                                        <li><a class="dropdown-item" href="#">Logout</a></li>

                                    </ul>
                                </div>
                       
                    </div>
                </div>

            </div>


        </div>
    </div>
</div>

<!-- Header -->
<header class="header-area four" id="header">
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <!-- Navbar Brand -->
            <a class="navbar-brand" href="index.html">
                <img src="{{asset('img/core-img/main_logo.png')}}" alt="Brand" style="height:200px !important;">
            </a>
            <!-- Navbar Toggler -->
            <button class="navbar-toggler" id="navbarToggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="icon-menu"></span>
            </button>


            <!-- Navbar -->
            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav navbar-nav-scroll mb-3 mb-lg-0" id="SupportHiveNav">
                    <li >
                        <a href="index.html">Home</a>
                        
                    </li>
                    <li class="dropdown-list">
                        <a href="#">Course</a>
                        <ul>
                            <li><a href="course-list.html">Course 1</a></li>
                            <li><a href="course-list.html">Course 2</a></li>
                            <li><a href="course-list.html">Course3</a></li>
                        </ul>
                    </li>

                    <li>
                        <a href="about.html">About Us</a>
                    </li>
                    <li>
                        <a href="contact.html">Contact us</a>
                    </li>
                    <li>
                        <a href="ourmission.html">Our Mission</a>
                    </li>
                    <li>
                        <a href="ourvision.html">Our Vision</a>
                    </li>
                </ul>

                <div class="contact-info- ml-auto">
                    <a class="login-btn" href="register.html">Join Now</a>
                </div>
            </div>
        </div>
    </nav>
</header>

    <div id="smooth-body">
        <div id="smooth-content">
            <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
                style="background-image: url(img/bg-img/home-3/bg.png);">
                <div class="container h-100">
                    <div class="row h-100 align-items-center">
                        <div class="col-12">
                            <div class="breadcrumb-conetnt">
                                <ul class="bread-list">
                                    <li><a href="index.html">Home</a></li>
                                    <li><i class="icon-down-arrow-11"></i></li>
                                    <li>Admin Panel</li>
                                </ul>
                                <h4 class="mb-0">Setting</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            <!-- teacher area -->
            
            <div class="log-regi-area">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-6 offset-lg-3">
                            <div class="log-area">
                                    <h3>Admin Panel (Setting)</h3>
                                    
                                    <form method="post"  id="contact-form-mejor">
                                        <div class="form-floating mb-5" class="col-lg-6">
                                            <input type="text" class="form-control" id="name" placeholder="Name">
                                            <label class="lable-text" for="name">Name</label>
                                        </div>
    
                                        <div class="form-floating mb-5"class="col-lg-6">
                                            <input type="email" class="form-control" id="email"
                                                placeholder="Email">
                                            <label class="lable-text" for="email">Email</label>
                                        </div>
    
                                        <div class="form-floating mb-5"class="col-lg-6">
                                            <input type="text" class="form-control" id="contact"
                                                placeholder="contact">
                                            <label class="lable-text" for="contact">Contact</label>
                                        </div>
                                        
                                        <div class="form-floating mb-5" class="col-lg-6">
                                            <input type="text" class="form-control" id="address"
                                                placeholder="address">
                                            <label class="lable-text" for="address">Address</label>
                                        </div>
                                        <div class="form-floating mb-5" class="col-lg-6">
                                            <input type="text" class="form-control" id="city"
                                                placeholder="city">
                                            <label class="lable-text" for="city">City</label>
                                        </div>

                                        <div class="form-floating mb-5" class="col-lg-6">
                                            <input type="text" class="form-control" id="state"
                                                placeholder="state">
                                            <label class="lable-text" for="address">State</label>
                                        </div>

                                        <div class="form-floating mb-5" class="col-lg-6">
                                            <input type="text" class="form-control" id="pincode"
                                                placeholder="pincode">
                                            <label class="lable-text" for="pincode">Pincode</label>
                                        </div>

                                        <div class="form-floating mb-5" class="col-lg-6">
                                            <input type="number" class="form-control" id="address"
                                                placeholder="address">
                                            <label class="lable-text" for="address">Latitude</label>
                                        </div>

                                        <div class="form-floating mb-5" class="col-lg-6">
                                            <input type="number" class="form-control" id="address"
                                                placeholder="address">
                                            <label class="lable-text" for="address">Longitude</label>
                                        </div>
                                        <div class="form-floating mb-5" class="col-lg-6">
                                            <textarea class="form-control" placeholder="description"
                                                id="description"></textarea>
                                            <label class="lable-text" for="description">Description</label>
                                        </div>
    
    
                                        <button type="submit" class="auth-btn w-100">Update</button>
                                    </form> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <!-- Contact us area -->

             <!-- Footer -->
             <footer class="footer-wrap bg--dark">
                <!-- Shape -->
                <div class="f-shape-1 wow fadeInUp" data-wow-delay="900ms">
                    <img src="{{asset('img/bg-img/f-shap-1.png')}}" alt="">
                </div>
                <!-- Shape -->
                <div class="f-shape-2 wow fadeInRight" data-wow-delay="700ms">
                    <img src="{{asset('img/bg-img/f-shap-2.png')}}" alt="">
                </div>
                <!-- Shape -->
                <div class="f-shape-3 wow fadeInRight" data-wow-delay="500ms">
                    <img src="{{asset('img/bg-img/f-shape-3.png')}}" alt="">
                </div>
                <div class="footer-content">
                    <div class="container">
                        <div class="row justify-content-between">
                            <div class="col-12 col-sm-6 col-lg-3">
                                <div class="me-4">
                                    <a class="mb-4 d-block footer-logo" href="#">
                                        <img src="{{asset('img/core-img/main_logo.png')}}" alt="">
                                    </a>
                                    <p class="footer-desc">Get 18,000+ best online courses from us </p>

                                    <div class="footer-contact-info wow fadeInLeft" data-wow-delay="700ms">
                                        <ul>
                                            <li><a href="#"><span class="icon-facebook-f"></span></a></li>
                                            <li><a href="#"><span class="icon-instagram"></span></a></li>
                                            <li><a href="#"><span class="icon-linkedin-in"></span></a></li>
                                            <li><a href="#"><span class="icon-instagram"></span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 col-sm-6 col-lg-2">
                                <div class="quick-links-nav">
                                    <h5 class="mb-3 text-white">Courses</h5>
                                    <span class="footer-shape-1"></span>
                                    <span class="footer-shape-2"></span>
                                    <ul>
                                        <li><a href="course-list.html">Course 1</a></li>
                                        <li><a href="course-list.html">Course 2</a></li>
                                        <li><a href="course-list.html">Course 3</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div class="col-12 col-sm-6 col-lg-2">
                                <div class="quick-links-nav">
                                    <h5 class="mb-3 text-white">Links</h5>
                                    <ul>
                                        <li><a href="about.html">About Us</a></li>
                                        <li><a href="faq.html">Faq</a></li>
                                        <li><a href="team.html">Team</a></li>
                                        <li><a href="pricing.html">Price</a></li>
                                        <li><a href="gallery.html">Gallery</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div class="col-12 col-sm-6 col-lg-3">
                                <div class="quick-contact-nav">
                                    <h5 class="mb-3 text-white">Contact</h5>
                                    <span class="footer-shape-1"></span>
                                    <span class="footer-shape-2"></span>
                                    <ul>
                                        <li>
                                            <p><span class="icon-incoming-call"></span> + 1 (246) 333-0088</p>
                                        </li>
                                        <li>
                                            <p><span class="icon-email"></span> alma.lawson@example.com</p>
                                        </li>
                                        <li>
                                            <p><span class="icon-map"></span> 4140 Parker Rd. Allentown, New Mexico
                                                31134</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="copy-right-area">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="copy-right-text text-center wow fadeInDown" data-wow-delay="900ms">
                                    <p class="mb-0"> © Copyright 2024 by <a href="#">Edumastery</a></p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>

    <div id="scrollToTop"><i class="icon-right-arrow-11"></i></div>

    <!-- All JavaScript Files -->
    <script src="./js/jquery.min.js"></script>
    <script src="./js/bootstrap.bundle.min.js"></script>
    <script src="./js/gsap/gsap.js"></script>
    <script src="./js/gsap/gsap-scroll-to-plugin.js"></script>
    <script src="./js/gsap/gsap-scroll-smooter.js"></script>
    <script src="./js/gsap/gsap-scroll-trigger.js"></script>
    <script src="./js/waypoints.min.js"></script>
    <script src="./js/owl.carousel.min.js"></script>
    <script src="./js/slidetoggle.min.js"></script>
    <script src="./js/nice-select2.js"></script>
    <script src="./js/swiper.min.js"></script>
    <script src="./js/counter-up.js"></script>
    <script src="./js/wow.js"></script>
    <script src="./js/custom.js"></script>
    <script src="./js/active.js"></script>

</body>

</html>