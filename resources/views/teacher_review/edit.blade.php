@extends('layouts.app')

@section('content')
<div class="row ">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Edit teacher_review
                </div>
                <div class="float-end">
                    <a href="{{ route('teacher_review.index') }}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div>
            </div>
            <div class="card-body">
                <form enctype="multipart/form-data"  action="{{ route('teacher_review.update',$teacher_review->id) }}" method="post">
                    @csrf
                    @method("PUT")
                    <div class="mb-3 row">
                    <div class="col-md-4 ">
                        <label for="teacher_id" class=" col-form-label text-md-end text-start">Teacher</label> 
                          <select  class="form-select @error('teacher_id') is-invalid @enderror" id="teacher_id" name="teacher_id" >
                            <option value="0" diasabled >--Choose Teacher--</option>
                                @if(!empty($teacherlist) && count($teacherlist)>0)
                                @foreach($teacherlist as $list)
                                <option value="{{$list->id}}" @if($teacher_review->teacher_id==$list->id) selected @endif >{{$list->name}}</option>
                                @endforeach
                                @endif
                          </select>
                            @error('teacher_id')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="col-md-4">
                        <label for="student_id" class=" col-form-label text-md-end text-start">Student</label> 
                          <select  class="form-select @error('student_id') is-invalid @enderror" id="student_id" name="student_id" >
                            <option value="0" diasabled >--Choose Student--</option>
                                @if(!empty($studentlist) && count($studentlist)>0)
                                @foreach($studentlist as $list)
                                <option value="{{$list->id}}" @if($teacher_review->student_id==$list->id) selected @endif >{{$list->name}}</option>
                                @endforeach
                                @endif
                          </select>
                            @error('student_id')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-4 ">
                        <label for="teacher_rating" class=" col-form-label text-md-end text-start"><b>Teacher Rating</b></label>
                          <select  class="form-select @error('teacher_rating') is-invalid @enderror" id="teacher_rating" name="teacher_rating" >
                            <option value="" diasabled >Choose Rating</option>
                            @php
                             $trating = !empty($teacher_review->teacher_rating)?$teacher_review->teacher_rating:0;   
                            @endphp
                           {!!Common::getRatingDropDown('teacher_rating',$trating)!!}
                          </select>
                            @error('teacher_rating')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-12" >
                        <label for="teacher_review" class="col-form-label text-md-end text-start ">Teacher Review</label>
                        <div class="col-md-12">
                          <textarea class=" @error('teacher_review') is-invalid @enderror summernote  " id="teacher_review" name="teacher_review" >{!! old('teacher_review' ,$teacher_review->teacher_review) !!}</textarea>
                            @error('description')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
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