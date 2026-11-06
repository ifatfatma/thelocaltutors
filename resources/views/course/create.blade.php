@extends('layouts.app')
 
@section('content')
<div class="row ">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Add New Course
                </div>
                <div class="float-end">
                    <a href="{{ route('course.index') }}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div>
            </div>
            <div class="card-body">
                <form  enctype="multipart/form-data" action="{{ route('course.store') }}" method="post">
                    @csrf
                    <div class="mb-3 row">
                    <div class="col-md-3 ">
                        <label for="category_id" class=" col-form-label text-md-end text-start">Category</label> 
                          <select  class="form-select @error('category_id') is-invalid @enderror" id="category_id" name="category_id" >
                            <option value="0" diasabled >--Choose Category--</option>
                                @if(!empty($coursecatlist) && count($coursecatlist)>0)
                                @foreach($coursecatlist as $list)
                                <option value="{{$list->id}}">{{$list->title}}</option>
                                @endforeach
                                @endif
                          </select>
                            @error('category_id')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    
                    <div class="col-md-3 ">
                        <label for="teacher_id" class=" col-form-label text-md-end text-start">Teacher</label> 
                          <select  class="form-select @error('teacher_id') is-invalid @enderror" id="teacher_id" name="teacher_id" >
                            <option value="0" diasabled >--Choose Teacher--</option>
                                @if(!empty($teacherlist) && count($teacherlist)>0)
                                @foreach($teacherlist as $list)
                                <option value="{{$list->id}}">{{$list->name}}</option>
                                @endforeach
                                @endif
                          </select>
                            @error('teacher_id')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                    <div class="col-md-2">
                        <label for="duration" class=" col-form-label text-md-end text-start">Duration(Month)</label>
                        <input type="text" class="form-control @error('duration') is-invalid @enderror" id="duration" name="duration" value="{{ old('duration') }}" placeholder="Duration of the course">
                        @error('duration')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="col-md-2">
                        <label for="price" class=" col-form-label text-md-end text-start">Price</label>
                        <input type="text" class="form-control @error('price') is-invalid @enderror" id="price" name="price" value="{{ old('price') }}" placeholder="Price of the Course">
                        @error('price')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>


                    <div class="col-md-2">
                        <label for="is_active" class=" col-form-label text-md-end text-start">Status</label>

                          <select class="form-select @error('is_active') is-invalid @enderror" id="is_active" name="is_active">
                            <option value="1" @if(old('is_active')) selected @endif >ACTIVE</option>
                            <option value="0" @if(!old('is_active')) selected @endif>NOT ACTIVE</option>
                          </select>
                            @error('is_active')
                                <span class="text-danger">{{ $is_active }}</span>
                            @enderror
                        </div>                                      
                    
                        <div class="col-md-12">
                        <label for="name" class=" col-form-label text-md-end text-start">Course Name</label>
                        <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') }}" placeholder="Course Name">
                        @error('name')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                        </div>
                    <div class="col-md-12" >
                        <label for="description" class="col-form-label text-md-end text-start ">Description</label>
                        <div class="col-md-12">
                          <textarea class=" @error('description') is-invalid @enderror summernote  " id="description" name="description" >{!!old('description')!!}</textarea>
                            @error('description')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    <div class="col-md-3 ">
                        <label for="teaching_mode" class=" col-form-label text-md-end text-start"><b>Teaching Mode</b></label>
                          <select  class="form-select @error('teaching_mode') is-invalid @enderror" multiple id="teaching_mode" name="teaching_mode[]" >
                            <option value="" disabled >Choose Teaching Mode</option>
                            @php
                             $tmode = !empty($teacher->teaching_mode)?$teacher->teaching_mode:''; 
                             $tmodeexplode = [];
                            if(!empty($tmode)){
                              $tmodeexplode = explode(",",$tmode);
                            }
                            @endphp
                           {!!Common::getCustomDropDown('teachmode',$tmodeexplode,'array')!!}
                          </select>
                            @error('teaching_mode')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="col-md-3">
                          <label for="image" class=" col-form-label text-md-end text-start"> Image (200X200,JPG,JPEG,PNG,2MB)</label>
                          <input type="file" class="form-control @error('image') is-invalid @enderror" id="image" name="image">
                            @error('image')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="col-md-3">
                        <label for="youtube_url" class=" col-form-label text-md-end text-start">Youtube URL(Demo)</label>
                        <input type="text" class="form-control @error('youtube_url') is-invalid @enderror" id="youtube_url" name="youtube_url" value="{{ old('youtube_url') }}" placeholder="Youtube Link">
                        @error('youtube_url')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                        </div>
                    
                    </div>

                    <div class="mb-3 row">
                        <input type="submit" class="col-md-3 offset-md-5 btn btn-primary" value="Submit">
                    </div>

                </form>
            </div> 
        </div>
    </div>
</div>    
@endsection