@extends('layouts.app')

@section('content')

<div class="card">
    <div class="card-header">Manage Course Category</div>
    <div class="card-body">
        @can('create-user')
            <a href="{{ route('course_category.create') }}" class="btn btn-success btn-sm my-2"><i class="bi bi-plus-circle"></i> Add New Course category</a>
        @endcan
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th scope="col">Sl No.</th>
                <th scope="col">Title</th>
                <th scope="col">Active</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($course_category as $list)
                <tr>
                    <th scope="row">{{ $loop->iteration }}</th>
                    <td>{{ $list->title }}</td>
                    <td>{{ $list->created_at }}</td>
                    <td>{{ $list->is_active==1?'YES':'NO' }}</td>
                    <td>
                        <form action="{{ route('course_category.destroy', $list->id) }}" method="post">
                            @csrf
                            @method('DELETE')
                            @can('edit-singlepages')
                                <a href="{{ route('course_category.edit', $list->id) }}" class="btn btn-primary btn-sm"><i class="bi bi-pencil-square"></i> Edit</a>
                            @endcan

                            @can('delete-singlepages')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Do you want to delete this Category of course?');"><i class="bi bi-trash"></i> Delete</button>
                            @endcan
                        </form>
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

        {{ $course_category->links() }}

    </div>
</div>
    
@endsection