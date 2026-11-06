<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Front extends Model
{
    use HasFactory,SoftDeletes;
    public function coursecategory(){
        return $this->hasOne(CourseCategory::class,'title');
    }
    public function teacher(){
        return $this->hasOne(User::class,'id','teacher_id');
    }
}
