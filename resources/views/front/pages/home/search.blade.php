
<div class="container h-100">
    <div class="row h-100 align-items-center justify-content-between">
        <div class="col-lg-7">
            <!-- Content text -->
                <div class="hero-content-text">
                @if(!empty(auth()->user()->id))
                        <h4 class="wow fadeInRight" data-wow-delay="500ms" style="color:grey">Welcome {{Auth::user()->name}} !!!</h4>
                @endif
                <h3 class="wow fadeInRight" data-wow-delay="900ms">What are you looking for?</h3>
                <p class="wow fadeInRight" data-wow-delay="1100ms">
                    <form id="searchForm" method="GET" action="{{route('front.search')}}">
                    <div class="row">
                        <div class="col-lg-4">
                            <select name="lookingfor" id="lookingfor" class="form-select mt-1">
                                <option value="">Looking For?</option>
                                @foreach(Common::getSearchCategory() as $catkey)
                                <option value="{{$catkey}}">{{$catkey}}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-lg-4">
                            <select name="search_state" id="search_state" class="form-select mt-1">
                                <option value="0">State</option>
                                {!!Common::getCustomDropDown('state')!!}
                            </select>
                        </div>
                        <div class="col-lg-4">
                            <select name="search_district" id="search_district" class="form-select mt-1">
                                <option value="0">District</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-4">
                            <select name="search_city" id="search_city" class="form-select mt-1">
                                <option value="0">City</option>
                            </select>
                        </div>
                        <div class="col-lg-4">
                            <select name="search_subject" id="search_subject" class="form-select mt-1">
                                <option value="0">Subject</option>
                                {!!Common::getCustomDropDown('subject')!!}
                            </select>
                        </div>
                        <div class="col-lg-4">
                            <select name="search_board" id="search_board" class="form-select mt-1">
                                <option value="0">Board</option>
                                {!!Common::getCustomDropDown('board')!!}
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-4">
                            <select name="search_gender" id="search_gender" class="form-select mt-1">
                                <option value="">Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div class="col-lg-4">
                            <select name="search_radius" id="search_radius" class="form-select mt-1">
                                <option value="0">Near By</option>
                                @for($k=1;$k<=10;$k++)
                                <option value="{{$k}}">{{$k}} KM</option>
                                @endfor
                            </select>
                        </div>
                        <div class="col-lg-4">
                            <button type="submit" name="" class="mt-1 auth-btn w-100 p-1 btn-sm" value="Search"><span class="icon-icon_search2"></span> Search</button>
                        </div>
                        
                    </div>
                    </form>
                </p>
            </div>
        </div>
    </div>