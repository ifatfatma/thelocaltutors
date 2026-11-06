@extends('front.layouts.layouts')
@section('title','Search History')
@section('content')
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url({{asset('img/bg-img/home-3/bg.png')}});">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="{{url('index')}}">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>Search History</li>
                        </ul>
                        <h4 class="mb-0">Search History</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container ">
        <div class="row">
            <div class="col-12">
                <h3 class="mt-20">Your Search History</h3>
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
                    <div class="table-responsive">
                    <table class="table table-striped" style="border: 1px solid black; position: sticky and overflow-y">
                            <thead>
                                <tr>
                                <th scope="col">Sl No.</th>
                                <th scope="col">Searced for</th>
                                <th scope="col">User</th>
                                <th scope="col">State</th>
                                <th scope="col">District</th>
                                <th scope="col">City</th>
                                <th scope="col">Board</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Radius</th>
                                <th scope="col">Searched At</th>
                                <th scope="col">Result</th>
                                <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            @if(!empty($searchlist) && count($searchlist)>0)  
                            @foreach($searchlist as $key=>$list) 
                                <tr>
                                    <th scope="row">{{ $loop->iteration }}</th>
                                    <td>{{ $list->lookingfor??'-' }}</td>
                                    <td>{{ $list->user->name??'-' }}</td>
                                    <td>{{ $list->statename->name??'-'}}</td>
                                    <td>{{ $list->districtname->name??'-' }}</td>
                                    <td>{{ $list->cityname->name??'-' }}</td>
                                    <td>{{ $list->boardname->name??'-' }}</td>
                                    <td>{{ $list->subjectname->name??'-' }}</td>
                                    <td>{{ $list->gender??'-' }}</td>
                                    <td>{{ $list->radius??'0' }} KM</td> 
                                    <td>{{date('d-M-Y', strtotime($list->created_at))}}</td>
                                    <td align="center">
                                    <form id="searchForm" method="GET" action="{{route('front.show.search',$list->id)}}">
                                    <button type="submit" name="" class="mt-1 auth-btn w-100 p-1 btn-sm" value="Search"><span class="icon-icon_search2"></span></button>
                                    </form>
                                    </td> 
                                    <td>
                                    <form action="{{ route('searchhistory.destroy', $list->id) }}" method="post">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="mt-1 delauth-btn  p-1 btn-sm" onclick="return confirm('Do you want to delete this record?');"><i class="icon icon_trash"></i> 🗑️</button>
                                    </form> 
                                    </td>
                                </tr>
                                    
                            @endforeach
                            <tr>
                                <td colspan="12">{{$searchlist->links()}} </td>
                            </tr>  
                            @else
                            <tr>
                                <td colspan="13">
                                    <span class="text-danger">
                                        <strong>No Record(s) Found!</strong>
                                    </span>
                                </td>
                            </tr>  
                            @endif
                            </tbody>
                        </table>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection 