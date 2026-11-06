@extends('layouts.app')

@section('content')
@php $linkurl=''; @endphp
@php if(!empty(Request()->type)){$linkurl.='?type='.Request()->type;}@endphp
@php if(isset(Request()->parent_id)){$linkurl.='&parent_id='.Request()->parent_id;}@endphp
<div class="card">
    <div class="card-header">{{Request()->type??'--'}} List</div>
    <div class="card-body">
        @can('create-customdata')
            <a href="{{route('customdata.create')}}{{$linkurl}}" class="btn btn-success btn-sm my-2"><i class="bi bi-plus-circle"></i> Add New</a>
            <a href="javascript:void(0);" class="btn btn-info btn-sm my-2" data-bs-toggle="modal" data-bs-target="#importcustomdata"><i class="bi bi-plus-circle"></i> Import Data</a>
        @endcan

        <!--modal -->
        <div class="modal fade" id="importcustomdata" tabindex="-1" aria-labelledby="importcustomdata" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="importcustomdata">Import Data</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form method="post" name="importdataform" enctype="multipart/form-data" action="{{route('customdata.import.post')}}">
                    @csrf
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            <h6>Import excel file only</h6>
                        </div>
                        <div class="col-md-12">
                            <input required type="file" name="excelfile" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Import</button>
                </div>
                </form>
                </div>
            </div>
            </div>
        <!--end modal -->
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th scope="col">S#</th>
                <th scope="col">Name</th>
                <th scope="col">Created</th>
                <th scope="col">Active</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($customdatas as $customdata)
                <tr>
                    <th scope="row">{{ $loop->iteration }}</th>
                    <td>{{ $customdata->name }}</td>
                    <td>{{ $customdata->created_at }}</td>
                    <td>{{ $customdata->is_active==1?'YES':'NO' }}</td>
                    <td>
                        <form action="{{ route('customdata.destroy', $customdata->id) }}" method="post">
                            @csrf
                            @method('DELETE')
                            @if(isset(Request()->parent_id))
                            <a href="{{ route('customdata.index') }}?type={{Request()->type}}&parent_id={{$customdata->id}}" class="btn btn-warning btn-sm"><i class="bi bi-plus"></i> Add New ({{$customdata->subdata_count}})</a>
                            @endif
                            @can('edit-customdata')
                                <a href="{{route('customdata.edit', $customdata->id)}}{{$linkurl}}" class="btn btn-primary btn-sm"><i class="bi bi-pencil-square"></i> Edit</a>
                            @endcan

                            @can('delete-customdata')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Do you want to delete this customdata?');"><i class="bi bi-trash"></i> Delete</button>
                            @endcan
                        </form>
                    </td>
                </tr>
                @empty
                    <td colspan="5">
                        <span class="text-danger">
                            <strong>No Record(s) Found!</strong>
                        </span>
                    </td>
                @endforelse
            </tbody>
        </table>

        {{ $customdatas->links() }}

    </div>
</div>
@endsection