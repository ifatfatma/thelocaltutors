@extends('layouts.app')

@section('content')

<div class="card">
    <div class="card-header">Manage Users</div>
    <div class="card-body">
        @can('create-user')
            <a href="{{ route('singlepages.create') }}" class="btn btn-success btn-sm my-2"><i class="bi bi-plus-circle"></i> Add New User</a>
        @endcan
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th scope="col">S#</th>
                <th scope="col">Title</th>
                <th scope="col">Key Name</th>
                <th scope="col">Active</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($singlepages as $list)
                <tr>
                    <th scope="row">{{ $loop->iteration }}</th>
                    <td>{{ $list->title }}</td>
                    <td>{{ $list->key_name }}</td>
                    <td>{{ $list->created_at }}</td>
                    <td>{{ $list->is_active==1?'YES':'NO' }}</td>
                    <td>
                    <div class="dropdown">
                        <a class="btn btn-sm btn-outline-info dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">Action</a>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                @can('edit-teacher')
                                <li><a href="{{ route('singlepages.edit', $list->id) }}" class="dropdown-item"><i class="bi bi-pencil-square"></i> Edit</a></li>
                                @endcan
                                @can('delete-teacher')
                                <li><a class="dropdown-item deleterecord" href="javascript:void(0);" id="{{$list->id}}" alink="{{ route('singlepages.destroy', $list->id) }}"><i class="bi bi-trash"></i> Delete</a></li>
                                @endcan
                            </ul>
                        </div>
                        
                    </td>
                </tr>
                @empty
                    <td colspan="8">
                        <span class="text-danger">
                            <strong>No Data Found!</strong>
                        </span>
                    </td>
                @endforelse
            </tbody>
        </table>

        {{ $singlepages->links() }}

    </div>
</div>
    
@endsection