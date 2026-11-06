<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory,SoftDeletes;

    public function teacher(){
        return $this->hasOne(User::class,'id','teacher_id');
    }
    public function faq(){
        return $this->hasMany(Faq::class,'id','is_active');
    }
    public function category(){
        return $this->hasOne(CourseCategory::class,'id','category_id');
    }
    public function feedback(){
        return $this->hasMany(CourseFeedback::class,'id','course_id');
    }
    

   
}
