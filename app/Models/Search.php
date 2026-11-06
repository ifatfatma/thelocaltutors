<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Search extends Model
{
    use HasFactory;
    protected $table="search";
    public function user(){
        return $this->hasOne(User::class,'id','user_id');
    }
    public function statename(){
    return $this->hasOne(CustomData::class,'id','state');
    }
    public function districtname(){
    return $this->hasOne(CustomData::class,'id','district');
    }
    public function cityname(){
    return $this->hasOne(CustomData::class,'id','city');
    }
    public function boardname(){
    return $this->hasOne(CustomData::class,'id','board');
    }
    public function subjectname(){
    return $this->hasOne(CustomData::class,'id','subject');
    }

}
