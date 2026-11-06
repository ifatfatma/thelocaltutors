@extends('layouts.app')

@section('content')
@php $linkurl=''; @endphp
@php if(!empty(Request()->type)){$linkurl.='?type='.Request()->type;}@endphp
@php if(isset(Request()->parent_id)){$linkurl.='&parent_id='.Request()->parent_id;}@endphp
<div class="row ">
    <div class="col-md-12">

        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Add New {{Request()->type??'--'}}
                </div>
                <div class="float-end">
                    <a href="{{route('customdata.index')}}{{$linkurl}}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div>
            </div>
            <div class="card-body">
                <form enctype="multipart/form-data" action="{{ route('customdata.store') }}" method="post">
                    @csrf
                    @if(!empty(Request()->type))
                    <input type="hidden" name="type" value="{{Request()->type??''}}">
                    @endif
                    @if(isset(Request()->parent_id))
                    <input type="hidden" name="parent_id" value="{{Request()->parent_id??0}}">
                    @endif

                    <div class="mb-3 row">
                        <div class="col-md-12">
                        <label for="name" class=" col-form-label text-md-end text-start">Name<font color="red">*</font></label>

                          <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') }}">
                            @error('name')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        
                    </div>


                

                    <div class="mb-3 row">
                        
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
                        <input type="submit" class="col-md-3 offset-md-5 btn btn-primary" value="Add {{Request()->type??'--'}}">
                    </div>
                    
                </form>
            </div>
        </div>
    </div>    
</div>
    
@endsection