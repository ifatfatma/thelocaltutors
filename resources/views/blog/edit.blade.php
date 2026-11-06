@extends('layouts.app')

@section('content')
<div class="row ">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Edit BLOG
                </div>
                <div class="float-end">
                    <a href="{{ route('blog.index') }}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div>
            </div>
            <div class="card-body">
                <form enctype="multipart/form-data"  action="{{ route('blog.update',$blog->id) }}" method="post">
                    @csrf
                    @method("PUT")
                    <div class="mb-3 row">
                    <div class="col-md-3">
                        <label for="title" class=" col-form-label text-md-end text-start">Blog Name</label>
                        <input type="text" class="form-control @error('title') is-invalid @enderror" id="title" name="title" value="{{ old('title' ,$blog->title) }}" placeholder="Enter Blog Name">
                        @error('name')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    

                    <div class="col-md-3">
                        <label for="date" class=" col-form-label text-md-end text-start">Blog date</label>
                        <input type="date" class="form-control @error('date') is-invalid @enderror" id="date" name="date" value="{{ old('date',$blog->date) }}" placeholder="Blog Date">
                        @error('date')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="col-md-3">
                        <label for="blog_by" class=" col-form-label text-md-end text-start">Blog By</label>
                        <input type="text" class="form-control @error('blog_by') is-invalid @enderror" id="blog_by" name="blog_by" value="{{ old('blog_by',$blog->blog_by) }}" placeholder="Author of the blog">
                        @error('blog_by')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="col-md-3">
                        <label for="blog_image" class=" col-form-label text-md-end text-start"> Blog Image (200X200,JPG,JPEG,PNG,2MB)</label>                    
                        @if(!empty($blog->blog_image))<img width="30" height="30" src="{{asset('blog/thumbnail/'.$blog->blog_image)}}">@endif

                        <input type="file" class="form-control @error('blog_image') is-invalid @enderror" id="blog_image" name="blog_image">
                        @error('blog_image')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="col-md-3">
                        <label for="blog_cover_image" class=" col-form-label text-md-end text-start"> Blog Cover Image (200X200,JPG,JPEG,PNG,2MB)</label>                    
                        @if(!empty($blog->blog_cover_image))<img width="30" height="30" src="{{asset('blog_cover_image/thumbnail/'.$blog->blog_cover_image)}}">@endif

                        <input type="file" class="form-control @error('blog_cover_image') is-invalid @enderror" id="blog_cover_image" name="blog_cover_image">
                        @error('blog_cover_image')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="col-md-3">
                        <label for="short_description" class=" col-form-label text-md-end text-start">Short Description</label>
                        <input type="text" class="form-control @error('short_description') is-invalid @enderror" id="short_description" name="short_description" value="{{ old('short_description',$blog->short_description) }}" placeholder="Short Description for cover page of blog">
                        @error('short_description')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>


                    <div class="col-md-3">
                        <label for="is_active" class=" col-form-label text-md-end text-start">Status</label>

                          <select class="form-select @error('is_active') is-invalid @enderror" id="is_active" name="is_active">
                            <option value="1" @if(old('is_active')==1 && $blog->is_active==1) selected @endif >ACTIVE</option>
                            <option value="0" @if(old('is_active')!=1 && $blog->is_active!=1) selected @endif>NOT ACTIVE</option>
                          </select>
                            @error('is_active')
                                <span class="text-danger">{{ $is_active }}</span>
                            @enderror
                        </div>                                      
                    

                    <div class="col-md-12" >
                        <label for="description" class="col-form-label text-md-end text-start ">Description</label>
                        <div class="col-md-12">
                          <textarea class=" @error('description') is-invalid @enderror summernote  " id="description" name="description" >{!!old('description',$blog->description)!!}</textarea>
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