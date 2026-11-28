<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstitutionInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'institution_id',
        'user_id',
        'student_name',
        'student_email',
        'student_phone',
        'program_interest',
        'message',
        'status',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'institution_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
