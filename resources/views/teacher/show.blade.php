@extends('layouts.app')

@section('content')

<div class="row ">
    <div class="col-md-22">

        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Teacher Information
                </div>
                <div class="float-end">
                    <a href="{{ route('teacher.index') }}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div>
            </div>
            

             <!-- Multi Columns Form -->
             <table class="table table-striped" width="100%" margin="1" cellspacing="2" cellpadding="2" >
              <!-- List group with custom content -->
                <tr >
                    <td class="fw-bold"> Name: </td>
                    <td class="text-secondary" width="80%"> {{$teacher->name??'--'}}</td>
                </tr> 
                <tr >
                    <td class="fw-bold">Email: </td>
                    <td class="text-secondary" width="80%"> {{$teacher->email??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Mobile:</td>
                    <td class="text-secondary" width="80%">{{$teacher->mobile??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Gender:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->gender??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">WhatsApp No.:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->whatsapp??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Experience:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->experience??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Qualification:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->qualification??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Teaching Mode:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->teaching_mode??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Board:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->board??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Days Available:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->days??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Timings:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->timings??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Address:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->address??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Sate:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->state??'--'}}</td>
                </tr>
                </tr>
                <tr >
                    <td class="fw-bold">City:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->city??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Pincode:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->pincode??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Block:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->block??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Street:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->street??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Police Station:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->police_station??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Post Office:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->post_office??'--'}}</td>
                <tr >
                    <td class="fw-bold">Latitude:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->latitude??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Longitude:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->longitude??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Descripton:</td>
                    <td class="text-secondary" width="80%">{{$teacher->teachermore->description??'--'}}</td>
                </tr>
                
                <tr >
                    <td class="fw-bold">Available (YES/NO):</td>
                    <td class="text-secondary" width="80%">@if(!empty($teacher->is_active)) <span class="text-success"> YES</span> @else <span class="text-danger"> NO</span> @endif</td>
                </tr>
                
            </table><!-- End Multi Columns Form -->

                <!-- <div class="col-lg-12">
                    <div class="row">
                        <label for="name" class="col-md-2 col-form-label text-md-end text-start"><strong>Name:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->name??'--' }}
                        </div>
                    </div>
                </div>

                <div class="col-lg-12">
                    <div class="row">
                        <label for="name" class="col-md-2 col-form-label text-md-end text-start"><strong>Email:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->email??'--' }}
                        </div>
                    </div>
                </div>

                <div class="col-lg-12">
                    <div class="row">
                        <label for="name" class="col-md-2 col-form-label text-md-end text-start"><strong>Mobile:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->mobile??'--' }}
                        </div>
                    </div>
                </div>
               
                <div class="col-lg-12">
                    <div class="row">
                        <label for="name" class="col-md-2 col-form-label text-md-end text-start"><strong>Gender:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->gender??'--' }}
                        </div>
                    </div>
                </div>


                    <div class="col-lg-12">
                    <div class="row">
                        <label for="name" class="col-md-2 col-form-label text-md-end text-start"><strong>WatsApp No.:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->whatsapp??'--' }}
                        </div>
                    </div>
                    </div>



                    <div class="col-lg-12">
                    <div class="row">
                        <label for="name" class="col-md-2 col-form-label text-md-end text-start"><strong>Experience:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->experience??'--' }}
                        </div>
                    </div>
                    </div>


                
                <div class="col-lg-12">
                    <div class="row">
                        <label for="description" class="col-md-2 col-form-label text-md-end text-start"><strong>Qualification:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->qualification??'--' }}
                        </div>
                    </div>
                    </div>


                    <div class="col-lg-12">
                    <div class="row">
                        <label for="description" class="col-md-2 col-form-label text-md-end text-start"><strong>Address:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->address??'--' }}
                        </div>
                    </div>
                    </div>


                    <div class="col-lg-12">
                    <div class="row">
                        <label for="description" class="col-md-2 col-form-label text-md-end text-start"><strong>City:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->city??'--' }}
                        </div>
                    </div>
                    </div>


                    <div class="col-lg-12">
                    <div class="row">
                        <label for="description" class="col-md-2 col-form-label text-md-end text-start"><strong>State:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->state??'--' }}
                        </div>
                    </div>
                    </div>


                    <div class="col-lg-12">
                    <div class="row">
                        <label for="description" class="col-md-2 col-form-label text-md-end text-start"><strong>Pincode:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->pincode??'--' }}
                        </div>
                    </div>
                    </div>


                    <div class="col-lg-12">
                    <div class="row">
                        <label for="description" class="col-md-2 col-form-label text-md-end text-start"><strong>Teaching Mode:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->teaching_mode??'--' }}
                        </div>
                    </div>
                    </div>


                    <div class="col-lg-12">
                    <div class="row">
                        <label for="description" class="col-md-2 col-form-label text-md-end text-start"><strong>Board:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->board??'--' }}
                        </div>
                    </div>
                    </div>

                    <div class="col-lg-12">
                    <div class="row">
                        <label for="description" class="col-md-2 col-form-label text-md-end text-start"><strong>Latitude:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->latitude??'--' }}
                        </div>
                    </div>
                    </div>

                    <div class="col-lg-12">
                    <div class="row">
                        <label for="description" class="col-md-2 col-form-label text-md-end text-start"><strong>Longitude:</strong></label>
                        <div class="col-md-6" style="line-height: 35px;">
                            {{ $teacher->teachermore->longitude??'--' }}
                        </div>
                    </div>
                    </div> -->
                </div>
            </div>
        </div>
    </div>    
</div>
    
@endsection