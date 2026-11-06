@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="row mt-1">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body text-center">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    @canany(['create-role', 'edit-role', 'delete-role'])
                        <a class="btn btn-default" href="{{ route('roles.index') }}">
                        <img class="card" src="{{asset('images/role.svg')}}" width="100"  >Roles</a>
                    @endcanany
                    @canany(['create-user', 'edit-user', 'delete-user'])
                        <a class="btn btn-default" href="{{ route('users.index') }}">
                        <img class="card" src="{{asset('images/users.svg')}}" width="100"  align="center">
                             Users</a>
                    @endcanany
                    @canany(['create-teacher', 'edit-teacher', 'delete-teacher'])
                        <a class="btn btn-default" href="{{ route('teacher.index') }}">
                        <img class="card" src="{{asset('images/teacher.svg')}}" width="100"  >
                         Teachers</a>
                    @endcanany
                    
                    <p>&nbsp;</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection