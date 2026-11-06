@extends('layouts.app')

@section('content')
<div class="row ">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Add New User
                </div>
                <div class="float-end">
                    <a href="{{ route('singlepages.index') }}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div>
            </div>
            <div class="card-body">
                <form action="{{ route('singlepages.store') }}" method="post">
                    @csrf
                    <div class="mb-3 row">
                    <div class="col-md-4">
                        <label for="title" class=" col-form-label text-md-end text-start">Title</label>
                          <input type="title" class="form-control @error('title') is-invalid @enderror" id="title" name="title" value="{{ old('title') }}">
                            @error('title')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="col-md-4">
                        <label for="key_name" class=" col-form-label text-md-end text-start">Key Name</label>
                          <input type="text" class="form-control @error('key_name') is-invalid @enderror" id="key_name" name="key_name" value="{{ old('key_name') }}">
                            @error('key_name')
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

                    <div class="col-md-12" >
                        <label for="description" class="col-form-label text-md-end text-start ">Description</label>
                        <div class="col-md-12">
                          <textarea class=" @error('description') is-invalid @enderror summernote  " id="description" name="description" value="{{ old('description') }}"></textarea>
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