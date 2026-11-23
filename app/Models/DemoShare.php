<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemoShare extends Model
{
    use HasFactory;

    protected $table = 'demo_shares';

    protected $fillable = [
        'contact_id',
        'teacher_demo_id',
        'student_name',
        'student_phone',
        'student_email',
        'token',
        'status',
        'shared_at',
        'viewed_at',
        'preferred_schedule',
        'student_notes',
    ];

    protected $casts = [
        'shared_at' => 'datetime',
        'viewed_at' => 'datetime',
    ];

    public function teacherDemo()
    {
        return $this->belongsTo(TeacherDemo::class, 'teacher_demo_id');
    }

    public function contact()
    {
        return $this->belongsTo(ContactUs::class, 'contact_id');
    }
}
