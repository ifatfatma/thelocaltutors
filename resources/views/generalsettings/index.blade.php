@extends('layouts.app')

@section('content')

<div class="row ">
    <div class="col-md-12">

        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    General Settings
                </div>
               
            </div>
            <div class="card-body">
                <form enctype="multipart/form-data" action="{{ route('settings.post') }}" method="post">
                    @csrf
                    @method("POST")
                    
                        <div class="mb-3 row">

                        <div class="col-md-4">
                        <label for="name" class=" col-form-label text-md-end text-start">Website Name</label>
                          <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name',$generalsettings->name??'') }}">
                            @error('name')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-4">
                        <label for="mobile" class=" col-form-label text-md-end text-start">Mobile</label>
                          <input type="number" class="form-control @error('mobile') is-invalid @enderror" id="mobile" name="mobile" value="{{ old('mobile',$generalsettings->mobile??'') }}">
                            @error('mobile')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-4">
                        <label for="email" class=" col-form-label text-md-end text-start">Email</label>
                          <input type="email" class="form-control @error('email') is-invalid @enderror" id="email" name="email" value="{{ old('email',$generalsettings->email??'') }}">
                            @error('email')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="col-md-3">
                        <label for="logo" class=" col-form-label text-md-end text-start">Logo</label>
                          <input type="file" class="form-control @error('logo') is-invalid @enderror" id="logo" name="logo" value="{{ old('logo',$generalsettings->logo??'') }}">
                            @error('logo')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="col-md-1">
                            @if(!empty($generalsettings->logo))
                            <img src="{{url('generalsettings/'.$generalsettings->logo)}}" width="60" height="60" style="position:absolute;top:160px;left:400px;">
                            @endif   
                        </div>

                        <div class="col-md-4">
                        <label for="address" class=" col-form-label text-md-end text-start">Address</label>
                          <input type="text" class="form-control @error('address') is-invalid @enderror" id="address" name="address" value="{{ old('address',$generalsettings->address??'') }}">
                            @error('address')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-4">
                        <label for="whatsapp" class=" col-form-label text-md-end text-start">WhatsApp</label>
                          <input type="number" class="form-control @error('whatsapp') is-invalid @enderror" id="whatsapp" name="whatsapp" value="{{ old('whatsapp',$generalsettings->whatsapp??'') }}">
                            @error('whatsapp')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>


                        <div class="col-md-4">
                        <label for="facebook" class=" col-form-label text-md-end text-start">Facebook</label>
                          <input type="text" class="form-control @error('facebook') is-invalid @enderror" id="facebook" name="facebook" value="{{ old('facebook',$generalsettings->facebook??'') }}">
                            @error('facebook')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        
                        <div class="col-md-4">
                        <label for="twitter" class=" col-form-label text-md-end text-start">Twitter</label>
                          <input type="text" class="form-control @error('twitter') is-invalid @enderror" id="twitter" name="twitter" value="{{ old('twitter',$generalsettings->twitter??'') }}">
                            @error('twitter')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-4">
                        <label for="youtube" class=" col-form-label text-md-end text-start">YouTube</label>
                          <input type="text" class="form-control @error('youtube') is-invalid @enderror" id="youtube" name="youtube" value="{{ old('youtube',$generalsettings->youtube??'') }}">
                            @error('youtube')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-4">
                        <label for="googleplus" class=" col-form-label text-md-end text-start">Google Plus</label>
                          <input type="text" class="form-control @error('googleplus') is-invalid @enderror" id="googleplus" name="googleplus" value="{{ old('googleplus',$generalsettings->googleplus??'') }}">
                            @error('googleplus')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-4">
                        <label for="linkedin" class=" col-form-label text-md-end text-start">Linkedin</label>
                          <input type="text" class="form-control @error('linkedin') is-invalid @enderror" id="linkedin" name="linkedin" value="{{ old('linkedin',$generalsettings->linkedin??'') }}">
                            @error('linkedin')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-4">
                        <label for="instagram" class=" col-form-label text-md-end text-start">instagram</label>
                          <input type="text" class="form-control @error('instagram') is-invalid @enderror" id="instagram" name="instagram" value="{{ old('instagram',$generalsettings->instagram??'') }}">
                            @error('instagram')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="col-md-12">
                        <label for="google_map" class=" col-form-label text-md-end text-start">Google Maps</label>
                          <textarea type="text" class="form-control @error('google_map') is-invalid @enderror" id="google_map" name="google_map" >{{ old('google_map',$generalsettings->google_map??'') }}</textarea>
                            @error('google_map')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                     
                    
                    <div class="mb-3 row mt-3">
                        <input type="submit" class="col-md-3 offset-md-5 btn btn-primary" value="Update">
                    </div>
                    </div>
                </form>
            </div>
        </div>
    </div>    
</div>
    
@endsection