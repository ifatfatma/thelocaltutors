@extends('front.layouts.layouts')
@section('title','Edit Profile')
@section('content')
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url(img/bg-img/home-3/bg.png);">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="{{url('index')}}">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>Edit Profile</li>
                        </ul>
                        <h4 class="mb-0">Edit Profile</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <!-- teacher area -->
    
    <div class="log-regi-area" style="padding:10px !important;">
        <div class="container"> 
            <div class="row">
                <div class="col-lg-12">
                    <div class="log-area">
                            <form class="row" enctype="multipart/form-data" action="{{ route('front.EditProfilePost.post') }}" method="post">
                                @csrf
                                @method("POST")                                
                                <div class="form-floating mb-5 col-lg-6" >
                                    <input required type="text" class="form-control" name="name" id="name" value="{{ $userdetails->name }}" placeholder="Name" >
                                    <label class="lable-text" for="name">Name</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6">
                                    <input type="file" class="form-control" name="image" id="image" >
                                    <label class="lable-text" for="mobile">Profile Image(200X200)</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6">
                                    <input type="email" class="form-control" name="email" id="email" value="{{ $userdetails->email }}"
                                        placeholder="Email">
                                    <label class="lable-text" for="email">Email</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6">
                                    <input type="text" class="form-control" name="mobile" id="mobile" value="{{ $userdetails->mobile }}" 
                                        placeholder="Mobile">
                                    <label class="lable-text" for="mobile">Mobile No.</label>
                                </div>
                                
                                @if(Auth::user()->type=='teacher')  

                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="whatsapp" name="whatsapp" value="@if(!empty($teacherdetails)){{ $teacherdetails->whatsapp }} @else @endif"
                                        placeholder="WhatsApp No.">
                                    <label class="lable-text" for="whatsapp">WhatsApp No.</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" name="address" id="address" value="@if(!empty($teacherdetails)){{ $teacherdetails->address }} @else @endif"
                                        placeholder="address">
                                    <label class="lable-text" name="address" for="address">Address</label>
                                </div>
                               
                                <div class="form-floating mb-5 col-lg-6">
                                    <select class="form-control @error('gender') is-invalid @enderror" id="gender" name="gender">
                                        <option value="">Choose Gender</option>
                                        <option value="Male" @if(old('gender')=='Male' || (!empty($teacherdetails->gender) && $teacherdetails->gender=="Male")) selected @endif >Male</option>
                                        <option value="Female" @if(old('gender')=='Female' || (!empty($teacherdetails->gender) && $teacherdetails->gender=="Female")) selected @endif>Female</option>
                                    </select>
                                    <label for="gender" class="lable-text">Gender</label>

                                </div>
                                <div class="form-floating mb-5 col-lg-6" >
                                    <select class="form-control" id="profile_state" name="state" >
                                        <option value="0" >Select state</option>
                                        @php $stateid = $teacherdetails->state??0; @endphp 
                                        {!!Common::getCustomDropDown('state',$stateid,'',0)!!}
                                    </select> 
                                    <label class="lable-text" for="state">State</label>
                                </div>
                                

                                <div class="form-floating mb-5 col-lg-6" >
                                    <select class="form-control" id="profile_district"  name="district">
                                        <option value="">Select District</option>
                                        @if(!empty($stateid))
                                        @php $districtid = $teacherdetails->district??0; @endphp 
                                        {!!Common::getCustomDropDown('state',$districtid,'',$stateid)!!}
                                        @endif
                                    </select>
                                    <label class="lable-text" for="district">District</label>
                                </div>


                                <div class="form-floating mb-5 col-lg-6" >
                                    <select class="form-control" id="profile_city"  name="city">
                                        <option value="">Select City</option>
                                        @if(!empty($districtid))
                                        @php $cityid = $teacherdetails->city??0; @endphp 
                                        {!!Common::getCustomDropDown('state',$cityid,'',$districtid)!!}
                                        @endif
                                    </select>
                                    <label class="lable-text" for="city">City</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="pincode" name="pincode" value="@if(!empty($teacherdetails)){{ $teacherdetails->pincode }} @else @endif"
                                        placeholder="pincode">
                                    <label class="lable-text" for="pincode">Pincode</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="block" name="block" value="@if(!empty($teacherdetails)){{ $teacherdetails->block }} @else @endif"
                                        placeholder="block">
                                    <label class="lable-text" for="block">Block</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="street" name="street" value="@if(!empty($teacherdetails)){{ $teacherdetails->street }} @else @endif"
                                        placeholder="street">
                                    <label class="lable-text" for="street">Street</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="post_office" name="post_office" value="@if(!empty($teacherdetails)){{ $teacherdetails->post_office }} @else @endif"
                                        placeholder="post_office">
                                    <label class="lable-text" for="post_office">Post Office</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="police_station" name="police_station" value="@if(!empty($teacherdetails)){{ $teacherdetails->police_station }} @else @endif"
                                        placeholder="police_station">
                                    <label class="lable-text" for="police_station">Police Station</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="timings" name="timings" value="@if(!empty($teacherdetails)){{ $teacherdetails->timings }} @else @endif"
                                        placeholder="timings">
                                    <label class="lable-text" for="pincode">Tutor Timings</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6">
                                    <select class="form-control @error('experience') is-invalid @enderror" id="experience" name="experience">
                                    @for($e=1;$e<=50;$e++)
                                    <option value="{{$e}}" @if(!empty($teacherdetails->experience) && $teacherdetails->experience==$e) selected @endif>{{$e}}</option>
                                    @endfor
                                    </select>
                                    <label for="experience" class="lable-text">Experience (Years)</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6">
                                    <select class="form-control @error('qualification') is-invalid @enderror" id="qualification" name="qualification[]">
                                    <option value="" diasabled >Choose Qualification</option>
                                    @php 
                                    $qualification = !empty($teacherdetails->qualification)?$teacherdetails->qualification:0;
                                    $qualificationexplode = [];
                                    if(!empty($qualification)){
                                    $qualificationexplode = explode(",",$qualification);
                                    }
                                    @endphp
                                {!!Common::getCustomDropDown('qualification',$qualificationexplode,'array')!!}
                                    </select>
                                    <label for="qualification" class="lable-text">Qualification</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6">
                                    <select class="form-control @error('subjects') is-invalid @enderror" multiple id="subjects" name="subjects[]">
                                    <option value="" disabled >Choose Subjects</option>
                                    @php 
                                    $subject = !empty($teacherdetails->subjects)?$teacherdetails->subjects:0; 
                                    $subjectexplode = [];
                                    if(!empty($subject)){
                                    $subjectexplode = explode(",",$subject);
                                    }
                                    @endphp
                                    {!!Common::getCustomDropDown('subject',$subjectexplode,'array')!!}
                                    </select>
                                    <label for="subjects" class="lable-text">Subjects</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6">
                                <select  class="form-control @error('days') is-invalid @enderror" multiple id="days" name="days[]" >
                                <option value="" disabled >Choose Teachig Days</option>
                                    @php 
                                    $days = !empty($teacherdetails->days)?$teacherdetails->days:0; 
                                    $daysexplode = [];
                                    if(!empty($days)){
                                    $daysexplode = explode(",",$days);
                                    }
                                    @endphp
                                {!!Common::getCustomDropDown('days',$daysexplode,'array')!!}
                                    </select>
                                    <label for="days" class="lable-text">Teaching Days</label>
                                </div>

                               <div class="form-floating mb-5 col-lg-6">
                                <select  class="form-control @error('teaching_mode') is-invalid @enderror" multiple id="teaching_mode" name="teaching_mode[]" >
                                    <option value="" diasabled >Choose Teaching Mode</option>
                                    @php
                                    $tmode = !empty($teacherdetails->teaching_mode)?$teacherdetails->teaching_mode:0; 
                                    $tmodeexplode = [];
                                    if(!empty($days)){
                                    $tmodeexplode = explode(",",$tmode);
                                    }
                                    @endphp
                                {!!Common::getCustomDropDown('teachmode',$tmodeexplode,'array')!!}
                                </select>
                                <label for="teaching_mode" class="lable-text">Teaching Mode</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6">
                                    <select  class="form-control @error('board') is-invalid @enderror" multiple id="board" name="board[]" >
                                        <option value="" disabled >Choose Board</option>
                                        @php 
                                        $board = !empty($teacherdetails->board)?$teacherdetails->board:0; 
                                        $boardexplode = [];
                                        if(!empty($board)){
                                        $boardexplode = explode(",",$board);
                                        }
                                        @endphp
                                    {!!Common::getCustomDropDown('board',$boardexplode,'array')!!}
                                    </select>
                                    <label for="board" class="lable-text">Boards</label>
                                </div>



                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="latitude" name="latitude"  value="@if(!empty($teacherdetails)){{ $teacherdetails->latitude }} @else @endif"
                                        placeholder="latitude">
                                    <label class="lable-text" for="latitude">Latitude</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="longitude" name="longitude"  value="@if(!empty($teacherdetails)){{ $teacherdetails->longitude}} @else  @endif"
                                        placeholder="longitude">
                                    <label class="lable-text" for="longitude">Longitude</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-12" > 
                                    <textarea class="form-control" placeholder="description" 
                                        id="description" name="description">@if(!empty($teacherdetails)){{ $teacherdetails->description }} @else @endif</textarea>
                                    <label class="lable-text" for="description">Description</label>
                                </div>

                                @endif

                                <button type="submit" class="auth-btn w-100">Update</button>
                        </form>                             
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <!-- Contact us area -->
@endsection