@php $commonsetting = Common::setting();@endphp
<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{$commonsetting->name??'--'}}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <!-- include summernote css/js-->
    <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js"></script>

<!--     <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
 -->    <link rel="stylesheet" href="{{asset('front/css/bootstrap.min.css')}}">
    <link href="{{asset('summernote-0.8.18/summernote.css')}}" rel="stylesheet">
    <script src="{{asset('summernote-0.8.18/summernote.js')}}"></script>
<script>
  $(document).ready(function(){
  
  $('.summernote').summernote({
    placeholder: 'Write description',
    tabsize: 2,
    height: 100
  });

  $(".deleterecord").click(function(){
   var alink = $(this).attr('alink');
   $("#delmodalbtn").attr('action',alink);
   $("#deleteModal").modal('show');
  });  

/*get district & city*/
    $('#admin_state').change(function(){
        var nid = $(this).val();
        if(nid!=0){
            $.ajax({
            type:"get",
            url:"/admin/getDistrictAjax/"+nid,
            success:function(res)
            {       
                    if(res)
                    {
                        $("#admin_district").empty();
                        $("#admin_district").append('<option value="0">Select District</option>');
                        $.each(res,function(key,value){
                            $("#admin_district").append('<option value="'+value.id+'">'+value.name+'</option>');
                        });
                    }
            }

            });
            }
    });

    $('#admin_district').change(function(){
        var nid = $(this).val();
        if(nid!=0){
            $.ajax({
            type:"get",
            url:"/admin/getCityAjax/"+nid,
            success:function(res)
            {       
                    if(res)
                    {
                        $("#admin_city").empty();
                        $("#admin_city").append('<option value="0">Select City</option>');
                        $.each(res,function(key,value){
                            $("#admin_city").append('<option value="'+value.id+'">'+value.name+'</option>');
                        });
                    }
            }

            });
            }
    });

});
 
</script>
    <!-- Scripts -->
    @vite(['resources/sass/app.scss', 'resources/js/adminapp.js']) 
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container-fluid">
                
                <a class="navbar-brand" href="{{ route('home') }}">
                    <img src="{{asset('images/logo.svg')}}" width="100"  >
               
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span> 
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav me-auto">
                    @guest
                            @if (Route::has('login'))
                                <!-- <li class="nav-item">
                                    <a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>
                                </li> -->
                            @endif

                            <!-- @if (Route::has('register'))
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>
                                </li>
                            @endif -->
                        @else
                            
                           
                            @canany(['create-teacher', 'edit-teacher', 'delete-teacher'])
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" href="#" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                Manage Teachers
                                </a>
                                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{ route('teacher.index') }}">
                                      List Teachers
                                    </a>
                                    <a class="dropdown-item" href="{{ route('teacher.create') }}">
                                      Create Teachers
                                    </a>
                                    <a class="dropdown-item" href="{{ route('teacher_review.index') }}">
                                      List Teacher Review
                                    </a>
                                    <a class="dropdown-item" href="{{ route('teacher_review.create') }}">
                                      Create Teacher Review
                                    </a>
                                </div>
                            </li>
                            @endcanany

                            @canany(['create-teacher', 'edit-teacher', 'delete-teacher'])
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" href="#" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                Manage Blogs
                                </a>
                                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{ route('blog.index') }}">
                                      List Blogs
                                    </a>
                                    <a class="dropdown-item" href="{{ route('blog.create') }}">
                                      Create Blog
                                    </a>
                                </div>
                            </li>
                            @endcanany

                            @canany(['create-teacher', 'edit-teacher', 'delete-teacher'])
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" href="#" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                Manage Courses
                                </a>
                                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{ route('course_category.index') }}">
                                      List Category
                                    </a>
                                    <a class="dropdown-item" href="{{ route('course_category.create') }}">
                                      Create Category
                                    </a>
                                    <a class="dropdown-item" href="{{ route('course.index') }}">
                                      List Courses
                                    </a>
                                    <a class="dropdown-item" href="{{ route('course.create') }}">
                                      Create Courses
                                    </a>
                                </div>
                            </li>
                            @endcanany

                            @canany(['view-message', 'list-message', 'delete-teacher'])
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" href="#" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                Manage Inbox
                                </a>
                                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{ route('messages.index') }}">
                                      List Messages
                                    </a>
                                    <a class="dropdown-item" href="{{ route('coursefeedback.list') }}">
                                      List Course Feedback
                                    </a>
                                    <a class="dropdown-item" href="{{ route('blogfeedback.list') }}">
                                      List Blog Feedback
                                    </a>
                                    
                                </div>
                            </li>
                            @endcanany
                           
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                   General Setting
                                </a>

                                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                   @canany(['create-customdata', 'edit-customdata', 'delete-customdata'])
                                    <a class="dropdown-item" href="{{ route('customdata.index') }}?type=state&parent_id=0">
                                      List State
                                    </a>
                                    <a class="dropdown-item" href="{{ route('customdata.index') }}?type=board">
                                      List Board
                                    </a>
                                    <a class="dropdown-item" href="{{ route('customdata.index') }}?type=qualification">
                                      List Qualification
                                    </a>
                                    <a class="dropdown-item" href="{{ route('customdata.index') }}?type=teachmode">
                                      List Teaching Mode
                                    </a>
                                    <a class="dropdown-item" href="{{ route('customdata.index') }}?type=days">
                                      List Days 
                                    </a>
                                    <a class="dropdown-item" href="{{ route('customdata.index') }}?type=subject">
                                      List Subjects 
                                    </a>
                                    <a class="dropdown-item" href="{{ route('customdata.index') }}?type=teacher_rating">
                                      List Ratings 
                                    </a>
                                    <a class="dropdown-item" href="{{ route('settings.index') }}">
                                      General Settings
                                    </a>
                                    <a class="dropdown-item" href="{{ route('singlepages.index') }}">
                                      Single Pages
                                    </a>
                                    <a class="dropdown-item" href="{{ route('faq.index') }}">
                                      FAQ (Frequently Asked Questions)
                                    </a>
                                    <a class="dropdown-item" href="{{ route('gallery.index') }}">
                                      Gallery
                                    </a>
                                    @endcanany
                                    @canany(['create-role', 'edit-role', 'delete-role'])
                                    <a class="dropdown-item" href="{{ route('roles.index') }}">
                                      List Roles
                                    </a>
                                    @endcanany
                                    @canany(['create-user', 'edit-user', 'delete-user'])
                                    <a class="dropdown-item" href="{{ route('users.index') }}">
                                      List Users
                                    </a>
                                    @endcanany

                                    <a class="dropdown-item" href="#"
                                       onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                        {{ __('Logout') }}
                                    </a>
                                    <form method="post" name="logout-form" id="logout-form" action="{{route('admin.logout')}}">@csrf</form>

                                </div>
                            </li>
                            
                        @endguest
                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ms-auto">
                        <!-- Authentication Links -->
                        
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Sidebar -->
  <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-white">
    
  </nav>
  <!-- Sidebar -->
  

        @include('layouts.footer')
    </div>
    
</body>
</html>