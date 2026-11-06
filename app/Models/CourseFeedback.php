<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseFeedback extends Model
{
    use HasFactory,SoftDeletes;
    public function user(){
        return $this->hasOne(User::class,'id','user_id');
    }

    public function course(){
        return $this->hasOne(Course::class,'id','course_id');
    } 
}
