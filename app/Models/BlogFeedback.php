<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogFeedback extends Model
{
    use HasFactory;
    public function user(){
        return $this->hasOne(User::class,'id','user_id');
    }

    public function blog(){
        return $this->hasOne(Blog::class,'id','blog_id');
    } 
}
 