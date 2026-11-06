
   @php
   $coursecategoryLists = App\Http\Controllers\Common::coursecategory();
   $setting = Common::setting();
   @endphp
   <!-- Header -->
    <header class="header-area four" id="header">
        <nav class="navbar navbar-expand-lg">
            <div class="container">
                <!-- Navbar Brand -->
                 @if(!empty($setting->logo))
                <a class="navbar-brand" href="{{url('/')}}">
                    <img src="{{url('generalsettings/'.$setting->logo)}}" alt="Brand" style="height:200px !important;">
                </a>
                @endif
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
                            <a href="{{url('/')}}">Home</a>
                            
                        </li>
                        <li class="dropdown-list">
                            <a href="javascript:void(0);">Courses</a>
                            <ul> 
                                @if(!empty($coursecategoryLists) && count($coursecategoryLists)>0)
                                @foreach($coursecategoryLists as $list)
                                <li><a href="{{url('course/'.$list->id.'/'.$list->slug)}}">{{$list->title}}</a></li>
                                @endforeach
                                @endif                               
                            </ul>
                        </li>

                        <li >
                            <a href="{{url('blogs')}}">Blogs</a>
                            
                        </li>

                        <li class="dropdown-list">
                            <a href="#">About Us</a>
                            <ul>
                                <li><a href="{{url('about')}}">About Us</a></li>
                                <li><a href="{{url('ourmission')}}">Our Mission</a></li>
                                <li><a href="{{url('ourvision')}}">Our Vision</a></li>
                                <li><a href="{{url('contact')}}">Contact us</a></li>
                            </ul>
                        </li>

                        


                        @if(!empty(auth()->user()->id))
                        <li class="dropdown-list">
                            <a href="#">My Account</a>
                            <ul>
                                <li><a href="{{url('dashboard')}}">Account Panel</a></li>
                                {{--<li><a href="{{url('changepassword')}}">Change Password</a></li>
                                <li><a href="{{url('editprofile')}}">Edit Profile</a></li>
                                <li><a href="{{url('searchhistory')}}">Search History</a></li>--}}
                                <li><a href="{{url('myfavouritecourses')}}">Saved Courses</a></li>
                                <li><a href="{{url('mycourses')}}">My Courses</a></li>
                                <li><hr></li>
                                <li><a href="{{route('front.logout')}}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();" style="color:#ff0000;">Logout</a></li>
                            </ul>
                            <form id="logout-form" action="{{ route('front.logout') }}" method="POST" style="display: none;">
                                {{ csrf_field() }}
                            </form>
                        </li>
                        
                        @endif
                    </ul>
                    @if(empty(auth()->user()->id))
                    <div class="contact-info- ml-auto">
                        <a class="login-btn" href="{{url('register')}}">Join Now</a>
                    </div>
                    @endif
                    
                </div>
            </div>
        </nav>
    </header>