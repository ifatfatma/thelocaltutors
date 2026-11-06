@extends('layouts.app')

@section('content')

<div class="card">
    <div class="card-header">List blogs</div>
    <div class="card-body">
        @can('create-user')
            <a href="{{ route('blog.create') }}" class="btn btn-success btn-sm my-2"><i class="bi bi-plus-circle"></i> Add New blog</a>
        @endcan
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th scope="col">Sl No.</th>
                <th scope="col">Image</th>
                <th scope="col">Title</th>
                <th scope="col">Active</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($blog as $list)
                <tr>
                    <th scope="row" with="40">{{ $loop->iteration }}</th>
                    <td>@if(!empty($list->blog_image))<img width="50" height="50" src="{{asset('blog/thumbnail/'.$list->blog_image)}}">@endif</td>
                    <td>{{ $list->title }}</td>
                    <td>{{ $list->created_at }}</td>
                    <td>{{ $list->is_active==1?'YES':'NO' }}</td>
                    <td>
                        <form action="{{ route('blog.destroy', $list->id) }}" method="post">
                            @csrf
                            @method('DELETE')
                            @can('edit-singlepages')
                                <a href="{{ route('blog.edit', $list->id) }}" class="btn btn-primary btn-sm"><i class="bi bi-pencil-square"></i> Edit</a>
                            @endcan

                            @can('delete-singlepages')
                            <a class="btn btn-primary btn-sm deleterecord" href="javascript:void(0);" id="{{$list->id}}" alink="{{ route('blog.destroy', $list->id) }}"><i class="bi bi-trash"></i> Delete</a>
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

        {{ $blog->links() }}

    </div>
</div>
    
@endsection