<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseFavourite extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = "favourite_course";
    public function user(){
        return $this->hasOne(User::class,'id','user_id');
    }

    public function course(){
        return $this->hasOne(Course::class,'id','course_id');
    } 
}
