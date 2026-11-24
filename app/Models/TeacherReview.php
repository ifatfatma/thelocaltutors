<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeacherReview extends Model
{
    use HasFactory,SoftDeletes;

    protected $guarded = [];

    public function teacher(){
        return $this->hasOne(User::class,'id','teacher_id');
    }
    public function reviewer(){
        return $this->hasOne(User::class,'id','student_id');
    }
}
