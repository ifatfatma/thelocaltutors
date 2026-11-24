<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $appends = ['title', 'slug'];

    /**
     * Accessor so $course->title returns $course->name transparently
     */
    public function getTitleAttribute()
    {
        return $this->attributes['name'] ?? ($this->attributes['title'] ?? '');
    }

    /**
     * Accessor so $course->slug returns a clean URL slug from name
     */
    public function getSlugAttribute()
    {
        return \Illuminate\Support\Str::slug($this->attributes['name'] ?? 'course');
    }

    public function teacher(){
        return $this->hasOne(User::class, 'id', 'teacher_id');
    }

    public function faq(){
        return $this->hasMany(Faq::class, 'id', 'is_active');
    }

    public function category(){
        return $this->hasOne(CourseCategory::class, 'id', 'category_id');
    }

    public function feedback(){
        return $this->hasMany(CourseFeedback::class, 'id', 'course_id');
    }

    public function enrollments(){
        return $this->hasMany(enrollCourse::class, 'course_id', 'id');
    }
}
