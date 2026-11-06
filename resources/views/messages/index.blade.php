@extends('layouts.app')

@section('content')

<div class="card">
    <div class="card-header">List Messages</div>
    <div class="card-body">
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th scope="col">Sl No.</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone No.</th>
                <th scope="col">Date</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($message as $list)
                  @php $txtcolor='';@endphp
                  @php if($list->is_read!=1){$txtcolor = 'class="text-success"';}else{$txtcolor='';} @endphp
                  <th scope="row">{{ $loop->iteration }}</th>
                  <td {!!$txtcolor!!}>{{$list->name??'--'}}</td>
                  <td {!!$txtcolor!!}>{{$list->email??'--'}}</td>
                  <td {!!$txtcolor!!}>{{$list->phone??'--'}}</td>
                  <td {!!$txtcolor!!}>{{$list->created_at??'--'}}</td>
                  <td>
                    <form action="{{ route('messages.destroy', $list->id) }}" method="post">
                        @csrf
                        @method('DELETE')
                        @can('view-message')
                        <a href="{{url('admin/messages/view/'.$list->id)}}" class="btn btn-outline-success btn-sm"><i class="bi bi-eye"></i></a>
                        @endcan
                        @can('delete-message')
                        <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Do you want to delete this Message?');"><i class="bi bi-trash"></i></button>
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

        {{ $message->links() }}

    </div>
</div>
    
@endsection