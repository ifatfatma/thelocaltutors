@extends('layouts.app')

@section('content')

<div class="card">
    <div class="card-header">List Teacher Reviews</div>
    <div class="card-body">
        @can('create-user')
            <a href="{{ route('teacher_review.create') }}" class="btn btn-success btn-sm my-2"><i class="bi bi-plus-circle"></i> Add New Teacher Review</a>
        @endcan
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th scope="col" width="10">Sl No.</th>
                <th scope="col" >Teacher</th>
                <th scope="col">Reviewer</th>
                <th scope="col">Message</th>
                <th scope="col">Rating</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($teacher_review as $list)
                <tr>
                    <th scope="row">{{ $loop->iteration }}</th>
                    <td>{{ $list->teacher->name??'--' }}</td>
                    <td>{{ $list->reviewer->name??'--' }}</td>
                    <td>{!!$list->teacher_review??''!!}</td>
                    <td>{{ $list->teacher_rating }}</td>
                    <td>
                        <input type="checkbox" name="is_active" class="changestatus" value="{{$list->id}}" {{ $list->is_active==1?'checked':'' }} > YES
                    </td>
                    <td>
                        <form action="{{ route('teacher_review.destroy', $list->id) }}" method="post">
                            @csrf
                            @method('DELETE')
                            @can('edit-singlepages')
                                <a href="{{ route('teacher_review.edit', $list->id) }}" class="btn btn-primary btn-sm"><i class="bi bi-pencil-square"></i> Edit</a>
                            @endcan

                            @can('delete-singlepages')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Do you want to delete this FAQ?');"><i class="bi bi-trash"></i> Delete</button>
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

        {{ $teacher_review->links() }}

    </div>
</div>
    
@endsection