@extends('layouts.app')

@section('content')

<div class="row ">
    <div class="col-md-12">

        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Add New Teacher
                </div>
                <div class="float-end">
                    <a href="{{ route('teacher.index') }}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div>
            </div>
            <div class="card-body">
                <form enctype="multipart/form-data" action="{{ route('teacher.store') }}" method="post">
                    @csrf
                    <input type="hidden" name="type" value="teacher">

                    <div class="mb-3 row">
                        <div class="col-md-4">
                        <label for="name" class=" col-form-label text-md-end text-start">Name<font color="red">*</font></label>

                          <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') }}">
                            @error('name')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="col-md-4">
                        <label for="email" class=" col-form-label text-md-end text-start">Email<font color="red">*</font></label>

                          <input type="email" class="form-control @error('email') is-invalid @enderror" id="email" name="email" value="{{ old('email') }}">
                            @error('email')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="col-md-4">
                        <label for="mobile" class=" col-form-label text-md-end text-start">Mobile<font color="red">*</font></label>
                          <input type="number" class="form-control @error('mobile') is-invalid @enderror" id="mobile" name="mobile" value="{{ old('mobile') }}">
                            @error('mobile')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    <div class="mb-3 row">
                        <div class="col-md-4">
                        <label for="username" class=" col-form-label text-md-end text-start">Username<font color="red">*</font></label>

                          <input type="text" class="form-control @error('username') is-invalid @enderror" id="username" name="username" value="{{ old('username') }}">
                            @error('username')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="col-md-4">
                        <label for="password" class=" col-form-label text-md-end text-start">Password<font color="red">*</font></label>

                          <input type="password" class="form-control @error('password') is-invalid @enderror" id="password" name="password" value="{{ old('password') }}">
                            @error('password')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="col-md-4">
                        <label for="is_active" class=" col-form-label text-md-end text-start">Status<font color="red">*</font></label>

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
                       <div class="col-md-4">
                          <label for="image" class=" col-form-label text-md-end text-start">Profile Image<font color="red">*</font> (200X200,JPG,JPEG,PNG,2MB)</label>

                          <input type="file" class="form-control @error('image') is-invalid @enderror" id="image" name="image" >
                            @error('image')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                    
                    <div class="mb-3 row">
                        <input type="submit" class="col-md-3 offset-md-5 btn btn-primary" value="Add teacher">
                    </div>
                    
                </form>
            </div>
        </div>
    </div>    
</div>
    
@endsection