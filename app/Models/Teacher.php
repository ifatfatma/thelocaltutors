<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = [
        'gender',        
        'description',
        'name',
        'address',
        'email',
        'mobile',
        'username',
        'image',
        'is_active',
        'street',
        'block',
        'police_station',
        'post_office',
        'days',
        'qualification',
        'timings',
        'teaching_mode',
        'experience',
        'subjects',
        'board',
        'city',
        'state',
        'pincode',
        'whatsapp',
        'type',
    ];

    public function qualificationname(){
     return $this->hasOne(CustomData::class,'id','qualification');
    }
    public function user(){
    return $this->hasOne(User::class,'id','user_id');
    }
}
