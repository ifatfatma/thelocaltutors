@extends('layouts.app')

@section('content')

<div class="card">
    <div class="card-header">List Gallery</div>
    <div class="card-body">
        @can('create-gallery')
            <a href="{{ route('gallery.create') }}" class="btn btn-success btn-sm my-2"><i class="bi bi-plus-circle"></i> Add New gallery</a>
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
                @forelse ($gallery as $list)
                <tr>
                    <th scope="row" with="40">{{ $loop->iteration }}</th>
                    <td>@if(!empty($list->gallery_image))<img width="50" height="50" src="{{asset('gallery/thumbnail/'.$list->gallery_image)}}">@endif</td>
                    <td>{{ $list->title }}</td>
                    <td>{{ $list->created_at }}</td>
                    <td>{{ $list->is_active==1?'YES':'NO' }}</td>
                    <td>
                        <form action="{{ route('gallery.destroy', $list->id) }}" method="post">
                            @csrf
                            @method('DELETE')
                            @can('edit-gallery')
                                <a href="{{ route('gallery.edit', $list->id) }}" class="btn btn-primary btn-sm"><i class="bi bi-pencil-square"></i> Edit</a>
                            @endcan

                            @can('delete-gallery')
                            <a class="btn btn-primary btn-sm deleterecord" href="javascript:void(0);" id="{{$list->id}}" alink="{{ route('gallery.destroy', $list->id) }}"><i class="bi bi-trash"></i> Delete</a>

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

        {{ $gallery->links() }}

    </div>
</div>
    
@endsection