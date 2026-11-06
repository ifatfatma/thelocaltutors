<main class="py-4">
            <div class="container-fluid">
                <div class="row mt-3">
                    <div class="col-md-12">
                        
                        @if ($message = Session::get('success'))
                            <div class="alert alert-success text-center" role="alert">
                                {{ $message }}
                            </div>
                        @endif

                        @yield('content')
                        
                        <div class="row justify-content-center text-center mt-3">
                            <div class="col-md-12">
                                <p>
                                @All Rights Reserved ,
                                <a href="https://www.iakwebtech.com/"><strong> IAK Webtech Solutions </strong></a>
                                </p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </main>

    <!--delete modal --> 
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content"> 
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModal">Alert</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Are you sure to delete this? After deleting it can not be reverted. 
        </div>
        <div class="modal-footer">
          <a type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</a>
          <form id="delmodalbtn" action="" method="post">
                              @csrf
                              @method('DELETE')
          <button type="submit" class="btn btn-danger">DELETE</button>
          </form>
        </div>
      </div>
    </div>
  </div>