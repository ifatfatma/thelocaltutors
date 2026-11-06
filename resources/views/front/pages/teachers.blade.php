@extends('front.layouts.layouts')
@section('title','Search Result')
@section('content')

    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url({{asset('img/bg-img/home-3/bg.png')}});">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="#">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>Search Panel</li>
                        </ul>
                        <h4 class="mb-0">Seach Panel</h4>
                    </div>
                 </div>
            </div>
        </div>
    </div>

    <!-- Login & Register Area -->
    <div class="course-details-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <p class="wow fadeInRight" data-wow-delay="1100ms">
                    <form id="searchForm" method="GET" action="{{route('front.search')}}">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <select required name="lookingfor" id="lookingfor" class="form-select mt-1">
                                                <option value="">Looking For?</option>
                                                @foreach(Common::getSearchCategory() as $catkey)
                                                <option value="{{$catkey}}" @if(!empty(Request()->lookingfor) && Request()->lookingfor==$catkey) selected @endif >{{$catkey}}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="col-lg-4">
                                            <select required name="search_state" id="search_state" class="form-select mt-1">
                                                <option value="0">State</option>
                                                @php $stateid = Request()->search_state??0; @endphp 
                                                {!!Common::getCustomDropDown('state',$stateid,'',0)!!}
                                            </select>
                                        </div>
                                        <div class="col-lg-4">
                                            <select required name="search_district" id="search_district" class="form-select mt-1">
                                                <option value="0">District</option>
                                                @if(!empty($stateid))
                                                @php $districtid = Request()->search_district??0; @endphp 
                                                {!!Common::getCustomDropDown('state',$districtid,'',$stateid)!!}
                                                @endif
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <select name="search_city" id="search_city" class="form-select mt-1">
                                                <option value="0">City</option>
                                                @if(!empty($districtid))
                                                @php $cityid = Request()->search_city??0; @endphp 
                                                {!!Common::getCustomDropDown('state',$cityid,'',$districtid)!!}
                                                @endif
                                            </select>
                                        </div>
                                        <div class="col-lg-4">
                                            <select required name="search_subject" id="search_subject" class="form-select mt-1">
                                                <option value="0">Subject</option>
                                                @php $subjectid = Request()->search_subject??0; @endphp 
                                                {!!Common::getCustomDropDown('subject',$subjectid)!!}
                                            </select>
                                        </div>
                                        <div class="col-lg-4">
                                            <select required name="search_board" id="search_board" class="form-select mt-1">
                                                <option value="0">Board</option>
                                                @php $boardid = Request()->search_board??0; @endphp 
                                                {!!Common::getCustomDropDown('board',$boardid)!!}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <select name="search_gender" id="search_gender" class="form-select mt-1">
                                                <option value="">Gender</option>
                                                <option value="Male" @if(Request()->search_gender=='Male') selected @endif>Male</option>
                                                <option value="Female" @if(Request()->search_gender=='Female') selected @endif>Female</option>
                                            </select>
                                        </div>
                                        @if(!empty(Session::get('latitude')) && !empty(Session::get('longitude')))
                                        <div class="col-lg-4">
                                            <select name="search_radius" id="search_radius" class="form-select mt-1">
                                                <option value="0">Near By</option>
                                                @for($k=1;$k<=10;$k++)
                                                <option value="{{$k}}" @if(Request()->search_radius==$k) selected @endif>{{$k}} KM</option>
                                                @endfor
                                            </select>
                                        </div>
                                        @endif
                                        <div class="col-lg-4">
                                            <button type="submit" name="" class="mt-1 auth-btn w-100 p-1 btn-sm" value="Search"><span class="icon-icon_search2"></span> Search</button>
                                        </div>
                                        
                                    </div>
                                    </form> 
                    </p>
                    <div class="course-details-content-area">
                                                        

                        <div class="other-ins-area">
                            @if(!empty($lists) && count($lists)>0) 
                            <div class="row">
                                @foreach($lists as $list)
                                @php $qualification = Common::custData($list->qualification); @endphp
                                <div class="col-md-6 " >
                                    <div class="inst-member-info d-flex align-items-center">
                                        <div class="inst-img">
                                            <img src="{{Common::profileimage($list->image)}}" height="100" width="100" alt="">
                                        </div>
                                           <div class="inst-info">
                                            <h4>{{$list->name??''}}<small class="teacher-content-rating">({!!Common::teacherRating($list->id)!!})</small> <a class="btn btn-success btn-sm float-end xteacherdetailspopup"  id="{{$list->id}}">...</a></h4>
                                            
                                            <span></span>
                                            <span ><b>Contact: </b>{{$list->teachermore->whatsapp??''}}</span><br>
                                            <span ><b>Address: </b>{{$list->teachermore->address??''}}</span>
                                            
                                            
                                        </div>
                                    </div>
                                    
                                </div>
                                @endforeach

                                <div class="row"><div class="col-lg-12">{{$lists->links()}}</div></div>
                            </div>
                            
                            @else 
                            <div class="text-center">
                            <p>No Results Found</p>
                            <p><img src="{{asset('front/img/bg-img/c-1.png')}}"></p>    
                            </div>
                            @endif
                        </div>
                    </div>
                </div>               
            </div>
        </div>
    </div>
    <!-- Login & Register Area -->

 
<div class="modal fadex mt-50" id="teacherModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Teacher's Details</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <span id="treacherxresponse"></span> 
      </div>
       
    </div>
  </div>
</div>
@endsection