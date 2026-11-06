@extends('layouts.app')

@section('content')

<div class="card">
    <div class="card-header">List Courses</div>
     <div class="card-body">
        @can('create-user')
            <a href="{{ route('course.create') }}" class="btn btn-success btn-sm my-2"><i class="bi bi-plus-circle"></i> Add New course</a>
        @endcan
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th scope="col" width="30">#</th>
                <th scope="col">Category</th>
                <th scope="col">Course Name</th>
                <th scope="col">Teacher</th>
                <th scope="col">Duration(Month)</th>
                <th scope="col">Price</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col" width="50">Action</th>
                </tr>
            </thead>
            <tbody>
            @forelse ($courses as $list)
            <tr>
                    <th scope="row">{{ $loop->iteration }}</th>
                    <td>{{ $list->category->title??'--' }}</td>
                    <td>{{ $list->name??'--' }}</td>
                    <td>{{ $list->teacher->name??'--' }}</td>
                    <td>{{ $list->duration??'--' }}</td>
                    <td>{{ $list->price??'--' }}</td>
                    <td>{{ $list->created_at }}</td>
                    <td>{{ $list->is_active==1?'YES':'NO' }}</td>
                    <td>
                    <a class="btn btn-sm btn-outline-info dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">Action</a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                           @can('edit-course')
                            <li><a href="{{ route('course.edit', $list->id) }}" class="dropdown-item"><i class="bi bi-pencil-square"></i> Edit</a></li>
                            @endcan

                            @can('delete-course')
                            <li><a class="dropdown-item deleterecord" href="javascript:void(0);" id="{{$list->id}}" alink="{{ route('course.destroy', $list->id) }}"><i class="bi bi-trash"></i> Delete</a></li>
                            <li><a href="{{ url('/course_faq', $list->id)}}" class="dropdown-item"><i class="bi bi-plus"></i> Course FAQ</a></li>

                            @endcan

                    </ul>
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

        {{ $courses->links() }}

    </div>
</div>
@endsection