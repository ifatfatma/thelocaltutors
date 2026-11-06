@extends('layouts.app')

@section('content')
<div class="row ">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Add New gallery
                </div>
                <div class="float-end">
                    <a href="{{ route('gallery.index') }}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div> 
            </div>
            <div class="card-body">
                <form  enctype="multipart/form-data" action="{{ route('gallery.store') }}" method="post">
                    @csrf
                    <div class="mb-3 row">

                    <div class="col-md-4">
                        <label for="title" class=" col-form-label text-md-end text-start">Gallery Title</label>
                        <input type="text" class="form-control @error('title') is-invalid @enderror" id="title" name="title" value="{{ old('title') }}" placeholder="Gallery Title">
                        @error('title')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    

                    <div class="col-md-4">
                        <label for="gallery_image" class=" col-form-label text-md-end text-start"> Image (200X200,JPG,JPEG,PNG,2MB)</label>
                        <input type="file" class="form-control @error('gallery_image') is-invalid @enderror" id="gallery_image" name="gallery_image">
                        @error('gallery_image')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    

                    <div class="col-md-4">
                        <label for="is_active" class=" col-form-label text-md-end text-start">Status</label>

                          <select class="form-select @error('is_active') is-invalid @enderror" id="is_active" name="is_active">
                            <option value="1" @if(old('is_active')) selected @endif >ACTIVE</option>
                            <option value="0" @if(!old('is_active')) selected @endif>NOT ACTIVE</option>
                          </select>
                            @error('is_active')
                                <span class="text-danger">{{ $is_active }}</span>
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