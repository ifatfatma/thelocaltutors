@extends('layouts.app')

@section('content')

<div class="row ">
    <div class="col-md-22">

        <div class="card">
            <div class="card-header">
                <div class="float-start">
                    Message Details
                </div>
                <div class="float-end">
                    <a href="{{ route('messages.index') }}" class="btn btn-primary btn-sm">&larr; Back</a>
                </div>
            </div>
            

             <!-- Multi Columns Form -->
             <table class="table table-striped" width="100%" margin="1" cellspacing="2" cellpadding="2" >
              <!-- List group with custom content -->
                <tr >
                    <td class="fw-bold"> Name: </td>
                    <td class="text-secondary" width="80%"> {{$messagesdetails->name??'--'}}</td>
                </tr> 
                <tr >
                    <td class="fw-bold">Email: </td>
                    <td class="text-secondary" width="80%"> {{$messagesdetails->email??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Phone No.:</td>
                    <td class="text-secondary" width="80%">{{$messagesdetails->phone??'--'}}</td>
                </tr>
                <tr >
                    <td class="fw-bold">Message:</td>
                    <td class="text-secondary" width="80%">{{$messagesdetails->message??'--'}}</td>
                </tr>
                
                
            </table>
                </div>
            </div>
        </div>
    </div>    
</div>
    
@endsection