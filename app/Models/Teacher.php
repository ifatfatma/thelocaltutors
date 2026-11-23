<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

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

    protected $appends = ['qualification_name', 'teaching_mode_name', 'subject_names', 'board_names'];

    public function qualificationname(){
        return $this->hasOne(CustomData::class, 'id', 'qualification');
    }

    public function user(){
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function getQualificationNameAttribute() {
        if (!$this->qualification) return 'Master Degree / Qualified Educator';
        $item = CustomData::find($this->qualification);
        return $item ? $item->name : $this->qualification;
    }

    public function getTeachingModeNameAttribute() {
        if (!$this->teaching_mode) return 'Home & Online Tuition';
        $item = CustomData::find($this->teaching_mode);
        return $item ? $item->name : $this->teaching_mode;
    }

    public function getSubjectNamesAttribute() {
        if (!$this->subjects) return 'Mathematics & Science';
        $ids = array_filter(explode(',', (string)$this->subjects));
        if (empty($ids)) return 'All Academic Subjects';
        $names = CustomData::whereIn('id', $ids)->pluck('name')->toArray();
        return !empty($names) ? implode(', ', $names) : 'Mathematics, Science, English';
    }

    public function getBoardNamesAttribute() {
        if (!$this->board) return 'CBSE / ICSE / WBBSE';
        $ids = array_filter(explode(',', (string)$this->board));
        if (empty($ids)) return 'All Boards';
        $names = CustomData::whereIn('id', $ids)->pluck('name')->toArray();
        return !empty($names) ? implode(', ', $names) : 'CBSE, ICSE, WBBSE';
    }
}
