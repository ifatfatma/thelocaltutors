<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\CustomData;
use App\Models\General_Setting;
use App\Models\CourseCategory;
use App\Models\CourseFavourite;
use App\Models\Course;
use App\Models\CourseFeedback;
use App\Models\enrollCourse;
use App\Models\TeacherReview;
use App\Models\Teacher;
use App\Models\Blog;
use App\Models\Gallery;
use App\Models\BlogFeedback;



use Auth;
use Log;
class Common extends Controller
{

/*   public static function getutubeid($url){
    parse_str( parse_url( $url, PHP_URL_QUERY ), $my_array_of_vars );
      dd( $my_array_of_vars);
    return $my_array_of_vars['v'];
  } */

  /* public static function getutubeid(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
 } */

  public static function getutubeid($url) {
    $parts = parse_url($url);
    if(isset($parts['query'])){
        parse_str($parts['query'], $qs);
        if(isset($qs['v'])){
            return $qs['v'];
        }else if(isset($qs['vi'])){
            return $qs['vi'];
        }
    }
    if(isset($parts['path'])){
        $path = explode('/', trim($parts['path'], '/'));
        return $path[count($path)-1];
    }
    return false;
  }

  public static function getSubjects($ids){
    $txt = '';
    $explode = array_filter(explode(',', (string)$ids));
    if (count($explode) > 0) {
      foreach ($explode as $sub) {
        $name = self::tmodeName($sub);
        if (!empty($name)) {
          $txt .= $name . ', ';
        }
      }
    } else {
      $txt = self::tmodeName($ids);
    }
    return rtrim($txt, ', ');
  }

  public static function custData($id){
    return CustomData::find($id);
  }

  public static function profileimage($image,$type='thumb'){
      $url = url('front/img/noprofileimage.png'); 
      if(!empty($image) && $type=='thumb'){
        $url = url('user/'.$image);
      }else if(!empty($image) && $type=='big'){
        $url = url('user/'.$image);
      }
      return $url;
  }
  public static function getSearchCategory(){
    return [
      'teacher','coaching-center','schools','college','university'
    ];
  }
  public static function getFavStatus($id){
    $flag = 0;
    if(!empty(Auth::user()->id)){
    $rec = CourseFavourite::where('course_id',$id)->where('user_id',Auth::user()->id)->get()->count();
    if(!empty($rec)){
    $flag = 1;
    }
    }
    return $flag;
  }
  public static function teacherImage($teacher){
    $img = url('img/bg-img/home-4/c-2.png');
   if(!empty($teacher->image)){
    $img = url('user/thumbnail/'.$teacher->image);
   }
   return $img;
  }
  public static function coursecategory(){
    return CourseCategory::where('is_active',1)->orderBy('title','asc')->get();
  }
  public static function homecoursecategory(){
    return CourseCategory::latest('id')->where('is_active',1)->take(4)->get();
  }
  public static function teachers(){
    return Teacher::with('user')->orderBy('id','desc')->get();
  }
  public static function blogs(){
    return Blog::orderBy('id','desc')->where('is_active',1)->take(3)->get();
  } 
  public static function blogsfeedbackcount($id){
    return BlogFeedback::where('blog_id',$id)->count();
  } 
  public static function coursecount(){
    return Course::orderBy('id','desc')->get()->count();
  } 
  public static function teacherscount(){
    return Teacher::orderBy('id','desc')->get()->count();
  }
  public static function enrollcoursecount(){
    return enrollCourse::orderBy('id','desc')->where('status','completed')->orwhere('status','accepted')->get()->count();
  }
  

  public static function gallery(){
    return Gallery::orderBy('id','desc')->get();
  }
  public static function setting(){
    return General_Setting::find(1);
  }
    //list option for 
    public static function getCustomDropDown($type,$id=0,$extra='',$parent=0){
        $txt = '';
     $custom = CustomData::where('key_name',$type)->where('parent_id',$parent)->orderBy('name','asc')->get();
     if(!empty($custom) && count($custom)>0){
      foreach($custom as $list){

        if($extra=='array'){
        if(in_array($list->id,$id)){$sl='selected';}else{$sl='';}
        }else{
          $sl = !empty($id) && $id==$list->id ? 'selected':'';
        }

        $txt.='<option value="'.$list->id.'" '.$sl.'>'.$list->name.'</option>';
      }
     }
     return $txt;
    }

    public static function getRatingDropDown($type,$id=0){
      $txt = '';
   $custom = CustomData::where('key_name',$type)->where('parent_id',0)->orderBy('name','asc')->get();
   if(!empty($custom) && count($custom)>0){
    foreach($custom as $list){

     
        $sl = !empty($id) && $id==$list->name ? 'selected':'';
      

      $txt.='<option value="'.$list->name.'" '.$sl.'>'.$list->name.'</option>';
    }
   }
   return $txt;
  }
    public static function sendOTP($to,$otp){
      $endpoint = "http://server.bulksmsserver.in/smsserver/?userid=&userpassword=Creation123&phonenumber=".$to."&text=your+OTP+is+".$otp;
      $client = new \GuzzleHttp\Client();
      $userid = "creationotp";
      $userpassword = "Creation123";
      $phonenumber = $to;
      $text = "your+OTP+is+".$otp;

      
      $response = $client->request('GET', $endpoint, ['query' => [
          'userid' => $userid, 
          'userpassword'  => $userpassword,
          'userpassword'  => $userpassword,
          'phonenumber'   => $phonenumber,
          'text'          => $text,
      ]]);
      
      
      $statusCode = $response->getStatusCode();
      $content = $response->getBody();
      
      Log::info($content.'|'.$phonenumber);
      return true;
    }

    //masked any number
    public static function maskNumber($num){
      return substr( $num, 0, 2 ) // Get the first two digits
        .str_repeat( '*', ( strlen( $num ) - 4 ) ) // Apply enough asterisks to cover the middle numbers
        .substr( $num, -2 );
    }

    public static function teacheroption($id=0){
      $teacher='';
      $data = Teacher::OrderBy('user_id','asc')->get();
      foreach($data as $list){
        $sl = $id==$list->id?'selected':'';
        $teacher.='<option value="'.$list->id.'" '.$sl.'>'.$list->user_id.'</option>';
      }
      return $teacher;
    }

 //teach mode names
 public static function getTeachMode($values){
  $txt = '';
  if(!empty($values)){
  $extra = explode(',',$values);
  foreach($extra as $id){
    $txt.=self::tmodeName($id).',';
  }
  }
 return $txt; 
}



public static function tmodeName($id){
  if (empty($id)) return '';
  $info = CustomData::where('id', $id)->first();
  return $info ? $info->name : '';
}

public static function getkeyname($id){
  $getname = SinglePage::where('id',$id)->first();
  return  $getname->slug;
}
public static function getpagename($id){
  $getname = SinglePage::where('id',$id)->first();
  return  $getname->name;
}

public static function getpagedetails($id){
  $getname = SinglePage::where('id',$id)->first();
  return  $getname->description;
}

public static function feedbackcount($courseid){
 return CourseFeedback::where('course_id',$courseid)->get()->count();
}

public static function courseRating($courseid)
{
    $ratinbgtxt='';$ratingAverage=0;
    $ratings = CourseFeedback::where('course_id',$courseid)->get();    
    if(!empty($ratings->sum('rating'))){  
    $ratingAverage = round($ratings->sum('rating') / $ratings->count());
    }
    if($ratingAverage<=1){
     $ratinbgtxt = '<i class="icon-star1"></i>'; 
    }else if($ratingAverage>1 && $ratingAverage <=2){
      $ratinbgtxt = '<i class="icon-star1"></i><i class="icon-star1"></i>'; 
    }else if($ratingAverage>2 && $ratingAverage <=3){
      $ratinbgtxt = '<i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i>'; 
    }else if($ratingAverage>3 && $ratingAverage <=4){
      $ratinbgtxt = '<i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i>'; 
    }else if($ratingAverage>4 && $ratingAverage <=5){
      $ratinbgtxt = '<i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i>'; 
    }

    return $ratinbgtxt;
}

public static function teacherRating($courseid)
{
    $ratinbgtxt='';$ratingAverage=0;
    $ratings = TeacherReview::where('teacher_id',$courseid)->get();  

    if(!empty($ratings->sum('teacher_rating'))){  
    $ratingAverage = round($ratings->sum('teacher_rating') / $ratings->count());
    }

    if($ratingAverage<=1){
     $ratinbgtxt = '<i class="icon-star1"></i>'; 
    }else if($ratingAverage>1 && $ratingAverage <=2){
      $ratinbgtxt = '<i class="icon-star1"></i><i class="icon-star1"></i>'; 
    }else if($ratingAverage>2 && $ratingAverage <=3){
      $ratinbgtxt = '<i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i>'; 
    }else if($ratingAverage>3 && $ratingAverage <=4){
      $ratinbgtxt = '<i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i>'; 
    }else if($ratingAverage>4 && $ratingAverage <=5){
      $ratinbgtxt = '<i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i><i class="icon-star1"></i>'; 
    }

    return $ratinbgtxt;
}

public static function checkenroll($courseid){
  $enrollbutton = '';
  if(!empty(Auth::user()->id) && !empty($courseid)){
      $enrollcourse = enrollCourse::where('course_id',$courseid)->where('user_id',Auth::user()->id)->where(function($sq){
      $sq->where('status','accepted')->orwhere('status','pending')->orwhere('status','completed');
      })->first();
      if(!empty($enrollcourse->id)){
       $enrollbutton = '<a  href="javascript:void(0);" class="auth-btn w-100 disabled"  >Enrolled</a>';
      }else{
      $enrollbutton = '<a  href="javascript:void(0);" class="auth-btn w-100 enrollcourse " id="'.$courseid.'">Enroll Course</a>';
    }
  }else{
    $enrollbutton = '<a  href="javascript:void(0);" class="auth-btn w-100 enrollcourse"  id="'.$courseid.'">Enroll Course</a>';
  }
  return $enrollbutton;
}

public static function enrollcount($courseid){
  $enrollcount ='';
  $enrollcount = enrollCourse::where('course_id',$courseid)->where(function($sq){
    $sq->where('status','accepted')->orwhere('status','completed');
    })->get()->count();
  return $enrollcount;
}

}
