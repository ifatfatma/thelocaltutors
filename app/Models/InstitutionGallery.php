<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstitutionGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'institution_id',
        'image_path',
        'caption',
        'category',
        'sort_order',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'institution_id');
    }
}
