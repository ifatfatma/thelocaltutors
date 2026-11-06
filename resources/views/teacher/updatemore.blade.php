@extends('layouts.app')

@section('content')

<div class="row ">
    <div class="col-md-12">

        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Update More Teacher Details
                </div>
                <div class="float-end">
                    <a href="{{ route('teacher.index') }}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div>
            </div>
            <div class="card-body">
                <form enctype="multipart/form-data" action="{{ route('teacher.updatemore.post', $user_id) }}" method="post">
                    @csrf
                    @method("POST")
                    
                        <div class="mb-3 row">


                        <div class="col-md-12 mt-2">
                        <label for="description" class=" col-form-label text-md-end text-start"><b>Description</b></label>
                          <textarea  class="form-control @error('description') is-invalid @enderror" id="description" name="description" >{{ old('description',$teacher->description??'') }}</textarea>
                            @error('description')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>


                        <div class="col-md-3 mt-2">
                        <label for="gender" class=" col-form-label text-md-end text-start"><b>Gender</b></label>

                          <select class="form-select @error('gender') is-invalid @enderror" id="gender" name="gender">
                            <option value="">Choose Gender</option>
                            <option value="Male" @if(old('gender')=='Male' || (!empty($teacher->gender) && $teacher->gender=="Male")) selected @endif >MALE</option>
                            <option value="Female" @if(old('gender')=='Female' || (!empty($teacher->gender) && $teacher->gender=="Female")) selected @endif>FEMALE</option>
                          </select>
                            @error('gender')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        

                        <div class="col-md-3 mt-2">
                        <label for="whatsapp" class=" col-form-label text-md-end text-start"><b>WhatsApp No.</b></label>
                          <input type="number" class="form-control @error('whatsapp') is-invalid @enderror" id="whatsapp" name="whatsapp" value="{{ old('whatsapp',$teacher->whatsapp??'') }}">
                            @error('mobile')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-3 mt-2">
                        <label for="timings" class=" col-form-label text-md-end text-start"><b>Timings</b></label>
                          <input type="text" class="form-control @error('timings') is-invalid @enderror" id="timings" name="timings" value="{{ old('timings',$teacher->timings??'') }}">
                            @error('timings')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-3 mt-2">
                        <label for="experience" class=" col-form-label text-md-end text-start"><b>Experience(Years)</b></label>
                          <select type="text" class="form-select @error('experience') is-invalid @enderror" id="experience" name="experience">
                            @for($e=1;$e<=50;$e++)
                            <option value="{{$e}}" @if(!empty($teacher->whatsapp) && $teacher->whatsapp==$e) selected @endif>{{$e}}</option>
                            @endfor
                          </select>
                            @error('experience')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-2 mt-2">
                        <label for="qualification" class=" col-form-label text-md-end text-start"><b>Qualification</b></label>
                          <select  class="form-select @error('qualification') is-invalid @enderror" multiple id="qualification" name="qualification[]" >
                            <option value="" diasabled >Choose Qualification</option>
                            @php 
                            $qualification = !empty($teacher->qualification)?$teacher->qualification:0;
                            $qualificationexplode = [];
                            if(!empty($qualification)){
                              $qualificationexplode = explode(",",$qualification);
                            }
                            @endphp
                           {!!Common::getCustomDropDown('qualification',$qualificationexplode,'array')!!}
                          </select>
                            @error('qualification')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-2 mt-2">
                        <label for="subjects" class=" col-form-label text-md-end text-start"><b>Subjects</b></label>
                          <select  class="form-select @error('subjects') is-invalid @enderror" multiple id="subjects" name="subjects[]" >
                            <option value="" disabled >Choose Subjects</option>
                            @php 
                            $subject = !empty($teacher->subjects)?$teacher->subjects:0; 
                            $subjectexplode = [];
                            if(!empty($subject)){
                              $subjectexplode = explode(",",$subject);
                            }
                            @endphp
                           {!!Common::getCustomDropDown('subject',$subjectexplode,'array')!!}
                          </select>
                            @error('subjects')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-2 mt-2">
                        <label for="days" class=" col-form-label text-md-end text-start"><b>Teaching Days</b></label>
                          <select  class="form-select @error('days') is-invalid @enderror" multiple id="days" name="days[]" >
                            <option value="" disabled >Choose Teachig Days</option>
                            @php 
                            $days = !empty($teacher->days)?$teacher->days:0; 
                            $daysexplode = [];
                            if(!empty($days)){
                              $daysexplode = explode(",",$days);
                            }
                            @endphp
                           {!!Common::getCustomDropDown('days',$daysexplode,'array')!!}
                          </select>
                            @error('days')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                          </div>

                        

                        <div class="col-md-2 mt-2">
                        <label for="teaching_mode" class=" col-form-label text-md-end text-start"><b>Teaching Mode</b></label>
                          <select  class="form-select @error('teaching_mode') is-invalid @enderror" multiple id="teaching_mode" name="teaching_mode[]" >
                            <option value="" diasabled >Choose Teaching Mode</option>
                            @php
                             $tmode = !empty($teacher->teaching_mode)?$teacher->teaching_mode:0; 
                             $tmodeexplode = [];
                            if(!empty($days)){
                              $tmodeexplode = explode(",",$tmode);
                            }
                            @endphp
                           {!!Common::getCustomDropDown('teachmode',$tmodeexplode,'array')!!}
                          </select>
                            @error('teaching_mode')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-2 mt-2">
                        <label for="board" class=" col-form-label text-md-end text-start"><b>Boards</b></label>
                          <select  class="form-select @error('board') is-invalid @enderror" multiple id="board" name="board[]" >
                            <option value="" disabled >Choose Board</option>
                            @php 
                            $board = !empty($teacher->board)?$teacher->board:0; 
                            $boardexplode = [];
                            if(!empty($board)){
                              $boardexplode = explode(",",$board);
                            }
                            @endphp
                           {!!Common::getCustomDropDown('board',$boardexplode,'array')!!}
                          </select>
                            @error('board')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>


                        <div class="col-md-2 mt-2">
                        <label for="address" class=" col-form-label text-md-end text-start"><b>Address</b></label>
                          <textarea rows="3" class="form-control @error('address') is-invalid @enderror" id="address" name="address" >{{ old('address',$teacher->address??'') }}</textarea>
                            @error('address')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                                           
                        <div class="col-md-3 mt-2">
                        <label for="state" class=" col-form-label text-md-end text-start"><b>State</b></label>
                          <select  class="form-select @error('state') is-invalid @enderror" id="admin_state" name="state" value="{{ old('state',$teacher->state??'') }}">
                            <option value="0">Choose State</option>
                            @php $state = !empty($teacher->state)?$teacher->state:0; @endphp
                           {!!Common::getCustomDropDown('state',$state,'',0)!!}
                          </select>
                            @error('state')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-3 mt-2">
                        <label for="district" class=" col-form-label text-md-end text-start"><b>District</b></label>
                          <select class="form-select @error('district') is-invalid @enderror" id="admin_district" name="district" >
                            <option value="0">Choose District</option>
                            @if(!empty($teacher->state))
                            @php $district = !empty($teacher->district)?$teacher->district:0; @endphp
                            {!!Common::getCustomDropDown('state',$district,'',$teacher->state)!!}
                            @endif
                          </select>
                            @error('district')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-3 mt-2">
                        <label for="city" class=" col-form-label text-md-end text-start"><b>City</b></label>
                          <select class="form-select @error('city') is-invalid @enderror" id="admin_city" name="city" >
                            <option value="0">Choose City</option>
                            @if(!empty($teacher->district))
                            @php $city = !empty($teacher->city)?$teacher->city:0; @endphp
                            {!!Common::getCustomDropDown('state',$city,'',$teacher->district)!!}
                            @endif
                          </select>
                            @error('city')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-3 mt-2">
                        <label for="block" class=" col-form-label text-md-end text-start"><b>Block</b></label>
                          <input type="text" class="form-control @error('block') is-invalid @enderror" id="block" name="block" value="{{ old('block',$teacher->block??'') }}">
                            @error('block')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-3 mt-2">
                        <label for="street" class=" col-form-label text-md-end text-start"><b>Street</b></label>
                          <input type="text" class="form-control @error('street') is-invalid @enderror" id="street" name="street" value="{{ old('street',$teacher->street??'') }}">
                            @error('street')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-3 mt-2">
                        <label for="pincode" class=" col-form-label text-md-end text-start"><b>Pincode</b></label>
                          <input type="text" class="form-control @error('pincode') is-invalid @enderror" id="pincode" name="pincode" value="{{ old('pincode',$teacher->pincode??'') }}">
                            @error('pincode')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-3 mt-2">
                        <label for="post_office" class=" col-form-label text-md-end text-start"><b>Post Office</b></label>
                          <input type="text" class="form-control @error('post_office') is-invalid @enderror" id="post_office" name="post_office" value="{{ old('post_office',$teacher->post_office??'') }}">
                            @error('post_office')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-3 mt-2">
                        <label for="police_station" class=" col-form-label text-md-end text-start"><b>Police Station</b></label>
                          <input type="text" class="form-control @error('police_station') is-invalid @enderror" id="police_station" name="police_station" value="{{ old('police_station',$teacher->police_station??'') }}">
                            @error('police_station')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                       

                        <div class="col-md-3 mt-2">
                        <label for="latitude" class=" col-form-label text-md-end text-start"><b>Latitude</b></label>
                          <input type="text" class="form-control @error('latitude') is-invalid @enderror" id="latitude" name="latitude" value="{{ old('latitude',$teacher->latitude??'') }}">
                            @error('latitude')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-3 mt-2">
                        <label for="longitude" class=" col-form-label text-md-end text-start"><b>Longitude</b></label>
                          <input type="text" class="form-control @error('longitude') is-invalid @enderror" id="longitude" name="longitude" value="{{ old('longitude',$teacher->longitude??'') }}">
                            @error('longitude')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        
                        
                    
                    <div class="mb-3 row mt-3">
                        <input type="submit" class="col-md-3  offset-md-5 btn btn-primary" value="Update">
                    </div>
                    </div>
                </form>
            </div>
        </div>
    </div>    
</div>
    
@endsection