@extends('layouts.app')

@section('content')

<div class="card">
    <div class="card-header">Blog Feedback List</div>
    <div class="card-body">
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th scope="col">Sl No.</th>
                <th scope="col">User</th>
                <th scope="col">Course</th>
                <th scope="col">Rating</th>
                <th scope="col">Feedback</th> 
                <th scope="col">Date</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($blogfeedback as $list)
                  <th scope="row">{{ $loop->iteration }}</th>
                  <td >{{$list->user->name??'--'}}</td>
                  <td >{{$list->blog->title??'--'}}</td>
                  <td >{{$list->rating??'--'}}</td>
                  <td >{{$list->blogfeedback??'--'}}</td>
                  <td >{{date('d M Y ', strtotime($list->created_at))}}</td>

                  <td>
                    @can('view-message')
                    @if($list->is_active==1)
                    <a disabled class="btn btn-secondary btn-sm">Accepted</a>
                    @else
                    <a href="{{ route('blogfeedback.accept',$list->id)}}" class="btn btn-success btn-sm">Accept</a>
                    @endif 
                    @endcan
                    @can('delete-blogfeedback')
                    <a class="btn btn-danger btn-sm-item deleterecord" href="javascript:void(0);" id="{{$list->id}}" alink="{{ route('blogfeedback.destroy', $list->id) }}"><i class="bi bi-trash"></i></a>
                    @endcan
                </td>
                </tr>
                @empty
                    <td colspan="7">
                        <span class="text-danger">
                            <strong>No Data Found!</strong>
                        </span>
                    </td>
                @endforelse
            </tbody>
        </table>

        {{ $blogfeedback->links() }}

    </div>
</div>
    
@endsection