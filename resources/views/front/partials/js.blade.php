<div id="scrollToTop"><i class="icon-right-arrow-11"></i></div>

<!-- All JavaScript Files -->
<script src="{{asset('front/js/jquery.min.js')}}"></script>
<script src="{{asset('front/js/bootstrap.bundle.min.js')}}"></script>
<script src="{{asset('front/js/gsap/gsap.js')}}"></script>
<script src="{{asset('front/js/gsap/gsap-scroll-to-plugin.js')}}"></script>
<script src="{{asset('front/js/gsap/gsap-scroll-smooter.js')}}"></script>
<script src="{{asset('front/js/gsap/gsap-scroll-trigger.js')}}"></script>
<script src="{{asset('front/js/waypoints.min.js')}}"></script>
<script src="{{asset('front/js/owl.carousel.min.js')}}"></script>
<script src="{{asset('front/js/slidetoggle.min.js')}}"></script>
<script src="{{asset('front/js/nice-select2.js')}}"></script>
<script src="{{asset('front/js/swiper.min.js')}}"></script>
<script src="{{asset('front/js/counter-up.js')}}"></script>
<script src="{{asset('front/js/wow.js')}}"></script>
<script src="{{asset('front/js/custom.js')}}"></script>
<script src="{{asset('front/js/active.js')}}"></script>
<script src="{{asset('front/js//toastr.min.js')}}"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

<script>
  toastr.options = {
  "debug": false,
  "positionClass": "toast-bottom-right",
  "onclick": null,
  "fadeIn": 300,
  "fadeOut": 1000,
  "timeOut": 5000,
  "extendedTimeOut": 1000
}

    $(document).on("click",".myfavcourse",function(){
  var id = $(this).attr('id'); 
  $.ajax({
        url: "{{route('front.addmyfavcourse')}}",
        type: "get",
        data: "id="+id ,
        success: function (response) {
         //alert(response.status)
         if((response.status) == 200){
          toastr.success(response.message)
         }else{
          toastr.error(response.message)
         }
           // You will get response from your PHP page (what you echo or print)
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
  }); 

  $(document).on("click",".enrollcourse",function(){
  var id = $(this).attr('id'); 
  $.ajax({
        url: "{{route('front.enrollcourse')}}",
        type: "get",
        data: "id="+id ,
        success: function (response) {
         //alert(response.status)
         if((response.status) == 200){
          $("#"+id).removeClass('enrollcourse')
          $("#"+id).addClass('disabled')
          $("#"+id).html('Enrolled')
          toastr.success(response.message)
         }else{
          toastr.error(response.message)
         }
           // You will get response from your PHP page (what you echo or print)
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
  }); 
  


  $(document).on("click","#postfeedback",function(){
    var course_id = $('#course_id').val(); 
  var rating = $('#rating').val(); 
  var feedback = $('#feedback').val(); 

  $.ajax({
        url: "{{route('front.feedback.post')}}",
        type: "GET",
        data: "rating="+rating+"&feedback="+feedback+"&course_id="+course_id,
        success: function (response) {
       
         if((response.status) == 200){
          toastr.success(response.message)
          $('#feedback').val('');
         }else{
          toastr.error(response.message)
         }
           // You will get response from your PHP page (what you echo or print)
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
  });

  $(document).on("click","#postblogfeedback",function(){
  var blog_id = $('#blog_id').val(); 
  var rating = $('#rating').val(); 
  var blogfeedback = $('#blogfeedback').val(); 

  $.ajax({
        url: "{{route('front.blog.feedback.post')}}",
        type: "GET",
        data: "rating="+rating+"&blogfeedback="+blogfeedback+"&blog_id="+blog_id,
        success: function (response) {
       
         if((response.status) == 200){
          toastr.success(response.message)
          $('#blogfeedback').val('');
         }else{
          toastr.error(response.message)
         }
           // You will get response from your PHP page (what you echo or print)
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
  });

   
  $(document).ready(function(){

    $(document).on("click",".teacherreviewbtn",function(){
     var id = $(this).attr('id');
     var teacher_rating = $("#teacher_rating").val();
     var teacher_review = $("#teacher_review").val();
     $.ajax({
            type:"get",
            url:"/postTeacherReviews?id="+id+"&teacher_rating="+teacher_rating+"&teacher_review="+teacher_review,
            success:function(res)
            {       
                    if(res.status==200)
                    {
                      toastr.success(res.message)                        
                    }else{
                      toastr.error(res.message)
                    }
            }

            });
    });

    $('#contactusform').on('submit', function(e) {
  //alert('Form Submitted');
    e.preventDefault(); 
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        url: "{{route('front.contact.post')}}",
        data: $(this).serialize(),
        success: function(msg) {
        if(msg.status == 200){
          toastr.success(msg.message)
          $('#name').val('');
          $('#email').val('');
          $('#phone').val('');
          $('#message').val('');
        }else{
          toastr.error(msg.message)
        }
        },
        error: function(jqXHR, textStatus, errorThrown) {
        toastr.error('Invalid Request while processing the form!');
        console.log(textStatus, errorThrown);
        }
    });
    return false;
});

    $('.xteacherdetailspopup').on('click',function(){
      var id = $(this).attr('id');
      
      $.ajax({
            type:"get",
            url:"/getTeacherDetailsAjax/"+id,
            success:function(res)
            {       
                    if(res.status==200)
                    {

                      $("#treacherxresponse").html(res.message)
                      $('#teacherModal').modal('show')
                        
                    }else{
                      toastr.error(res.message)
                    } 
            }

            });
      
    })
    $('.btn-close').on('click',function(){ 
      $('#teacherModal').modal('hide')
    });

    $('.teamteacherdetails').on('click',function(){
      var id = $(this).attr('id');
      
      $.ajax({
            type:"get",
            url:"/getTeamTeacherDetailsAjax/"+id,
            success:function(res)
            {       
                    if(res.status==200)
                    {

                      $("#teamtreacherxresponse").html(res.message)
                      $('#teamteacherModal').modal('show')
                        
                    }else{
                      toastr.error(res.message)
                    }  
            }
 
            });
      
    })
    $('.btn-close').on('click',function(){ 
      $('#teamteacherModal').modal('hide')
    });


    //popup youtube video for course
    $('.coursevideomodal').on('click',function(){
      var id = $(this).attr('id');
      
      $('#coursevideomodal').modal('show')      
    })
    $('.btn-close').on('click',function(){ 
      $('#coursevideoModal').modal('hide')
    });

   

    
  

  /*get district & city*/
    $('#search_state').change(function(){
        var nid = $(this).val();
        if(nid!=0){
            $.ajax({
            type:"get",
            url:"/getDistrictAjax/"+nid,
            success:function(res)
            {       
                    if(res)
                    {
                        $("#search_district").empty();
                        $("#search_district").append('<option value="0">District</option>');
                        $.each(res,function(key,value){
                            $("#search_district").append('<option value="'+value.id+'">'+value.name+'</option>');
                        });
                    }
            }

            });
            }
    });

    $('#search_district').change(function(){
        var nid = $(this).val();
        if(nid!=0){
            $.ajax({
            type:"get",
            url:"/getCityAjax/"+nid,
            success:function(res)
            {       
                    if(res)
                    {
                        $("#search_city").empty();
                        $("#search_city").append('<option value="0">City</option>');
                        $.each(res,function(key,value){
                            $("#search_city").append('<option value="'+value.id+'">'+value.name+'</option>');
                        });
                    }
            }

            });
            }
    });

    $('#profile_state').change(function(){
        var nid = $(this).val();
        if(nid!=0){
            $.ajax({
            type:"get",
            url:"/getprofileDistrictAjax/"+nid,
            success:function(res)
            {       
                    if(res)
                    {
                        $("#profile_district").empty();
                        $("#profile_district").append('<option value="0">District</option>');
                        $.each(res,function(key,value){
                            $("#profile_district").append('<option value="'+value.id+'">'+value.name+'</option>');
                        });
                    }
            }

            });
            }
    });

    $('#profile_district').change(function(){
        var nid = $(this).val();
        if(nid!=0){
            $.ajax({
            type:"get",
            url:"/getprofileCityAjax/"+nid,
            success:function(res)
            {       
                    if(res)
                    {
                        $("#profile_city").empty();
                        $("#profile_city").append('<option value="0">City</option>');
                        $.each(res,function(key,value){
                            $("#profile_city").append('<option value="'+value.id+'">'+value.name+'</option>');
                        });
                    }
            }

            });
            }
    });


  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        //console.log(position);
        //console.log(position.coords.latitude);
        //console.log(position.coords.longitude);
        if(position.coords.latitude!="undefined" && position.coords.longitude!="undefined"){
        $.ajax({
            type:"get",
            url:"/savelatlong/"+position.coords.latitude+"/"+position.coords.longitude,
            success:function(res)
            {       
              console.log(res.message)
            }

            });
          }
    });
}




</script>