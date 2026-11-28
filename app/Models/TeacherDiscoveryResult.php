<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherDiscoveryResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'search_id',
        'teacher_name',
        'profile_image',
        'gender',
        'email',
        'phone',
        'whatsapp',
        'normalized_name',
        'normalized_email',
        'normalized_phone',
        'country',
        'state',
        'city',
        'locality',
        'full_address',
        'subjects',
        'qualification',
        'specialization',
        'experience',
        'teaching_mode',
        'available_classes',
        'hourly_fees',
        'institute_name',
        'biography',
        'source_name',
        'source_url',
        'source_url_hash',
        'source_verification_status',
        'raw_data',
        'duplicate_status',
        'duplicate_match_reason',
        'matched_user_id',
        'import_status',
        'verification_status',
        'imported_user_id',
        'imported_teacher_id',
        'imported_at',
    ];

    protected $casts = [
        'subjects'    => 'array',
        'raw_data'    => 'array',
        'imported_at' => 'datetime',
    ];

    public function search()
    {
        return $this->belongsTo(TeacherDiscoverySearch::class, 'search_id');
    }

    public function importedTeacher()
    {
        return $this->belongsTo(Teacher::class, 'imported_teacher_id');
    }

    public function importedUser()
    {
        return $this->belongsTo(User::class, 'imported_user_id');
    }
}
