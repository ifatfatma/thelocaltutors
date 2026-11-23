<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use HasFactory, SoftDeletes;

    protected $appends = ['image', 'short_desc'];

    public function getImageAttribute()
    {
        return $this->attributes['blog_image'] ?? ($this->attributes['image'] ?? null);
    }

    public function getShortDescAttribute()
    {
        return $this->attributes['short_description'] ?? ($this->attributes['short_desc'] ?? null);
    }
}
