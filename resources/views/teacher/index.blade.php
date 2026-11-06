@extends('layouts.app')

@section('content')
<div class="card">
    <div class="card-header">Teacher List</div>
    <div class="card-body">
        @can('create-teacher')
            <a href="{{ route('teacher.create') }}" class="btn btn-success btn-sm my-2"><i class="bi bi-plus-circle"></i> Add New teacher</a>
        @endcan
        <!-- search box -->
        <form method="get" action="?">
        <div class="input-group float-end my-2" style="width:300px !important;" >
            
             <input name="sq" value="{{Request()->sq}}" type="text" class="form-control form-control-sm" placeholder="Enter Search Keyword" aria-label="Recipient's username" aria-describedby="button-addon2">
             <button class="btn btn-outline-secondary btn-sm" type="submit">Search</button>
            
        </div></form>
        <!-- search end box -->
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th scope="col">S#</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Mobile</th>
                <th scope="col">Created</th>
                <th scope="col">Active</th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($teachers as $teacher)
                <tr>
                    <th scope="row">{{ $loop->iteration }}</th>
                    <td><img src="{{asset('user/thumbnail/'.$teacher->image)}}" width="50" height="50"></td>
                    <td>{{ $teacher->name }}</td>
                    <td>{{ $teacher->email }}</td>
                    <td>{{ $teacher->mobile }}</td>
                    <td>{{ $teacher->created_at }}</td>
                    <td>{{ $teacher->is_active==1?'YES':'NO' }}</td>
                    <td>

                        <div class="dropdown">
                            <a class="btn btn-sm btn-outline-info dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">Action</a>

                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <li><a href="{{ route('teacher.show', $teacher->id) }}"  class="dropdown-item" ><i class="bi bi-eye"></i> Show</a></li>
                                @can('edit-teacher')
                                <li><a href="{{ route('teacher.edit', $teacher->id) }}" class="dropdown-item" ><i class="bi bi-pencil-square"></i> Edit</a></li>
                                @endcan 
                                @can('update-more-teacher')
                                <li><a href="{{ route('teacher.updatemore', $teacher->id) }}" class="dropdown-item" ><i class="bi bi-plus"></i> Update More</a></li>
                                @endcan
                                @can('delete-teacher')
                                <li><a class="dropdown-item deleterecord" href="javascript:void(0);" id="{{$teacher->id}}" alink="{{ route('teacher.destroy', $teacher->id) }}"><i class="bi bi-trash"></i> Delete</a></li>
                                @endcan
                            </ul>
                        </div>
                        
                    </td>
                </tr>
                @empty
                    <td colspan="8">
                        <span class="text-danger">
                            <strong>No teacher Found!</strong>
                        </span>
                    </td>
                @endforelse
            </tbody>
        </table>

        {{ $teachers->links() }}

    </div>
</div>
@endsection