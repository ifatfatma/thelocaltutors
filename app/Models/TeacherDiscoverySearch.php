<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherDiscoverySearch extends Model
{
    use HasFactory;

    protected $fillable = [
        'country',
        'state',
        'city',
        'locality',
        'subject',
        'teacher_type',
        'experience_filter',
        'teaching_mode',
        'max_records',
        'search_provider',
        'queries_executed',
        'total_found',
        'total_imported',
        'total_duplicates',
        'total_rejected',
        'progress_percent',
        'status',
        'error_message',
        'created_by',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'queries_executed' => 'array',
        'started_at'       => 'datetime',
        'completed_at'     => 'datetime',
    ];

    public function results()
    {
        return $this->hasMany(TeacherDiscoveryResult::class, 'search_id')->orderBy('id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
