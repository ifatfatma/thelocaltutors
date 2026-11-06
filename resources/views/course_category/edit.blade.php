@extends('layouts.app')

@section('content')
<div class="row ">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Edit Course Category
                </div>
                <div class="float-end">
                    <a href="{{ route('course_category.index') }}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div>
            </div>
            <div class="card-body">
                <form action="{{ route('course_category.update',$course_category->id) }}" enctype="multipart/form-data" method="post">
                    @csrf
                    @method("PUT")
                    <div class="mb-3 row">
                    <div class="col-md-4">
                        <label for="title" class=" col-form-label text-md-end text-start">Title</label>
                          <input type="title" class="form-control @error('title') is-invalid @enderror" id="title" name="title" value="{{ old('title' ,$course_category->title) }}">
                            @error('title')
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
                        <div class="col-md-1">
                        @if(!empty($coursecategory->image)) <img class="mt-3" width="40" height="40" src="{{url('coursecategory/'.$course_category->image)}}"> @endif
                        </div>
                       
                    <div class="col-md-4">
                        <label for="is_active" class=" col-form-label text-md-end text-start">Status</label>

                          <select class="form-select @error('is_active') is-invalid @enderror" id="is_active" name="is_active">
                            <option value="1" @if($course_category->is_active==1) selected @endif >ACTIVE</option>
                            <option value="0" @if($course_category->is_active==0) selected @endif>NOT ACTIVE</option>
                          </select>
                            @error('is_active')
                                <span class="text-danger">{{ $is_active }}</span>
                            @enderror
                        </div>

                    <div class="col-md-12" >
                        <label for="description" class="col-form-label text-md-end text-start ">Description</label>
                        <div class="col-md-12">
                          <textarea class=" @error('description') is-invalid @enderror summernote  " id="description" name="description" >{{ old('description',$course_category->description) }}</textarea>
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