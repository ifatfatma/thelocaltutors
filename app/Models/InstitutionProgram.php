<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstitutionProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'institution_id',
        'title',
        'level',
        'duration',
        'mode',
        'fee_amount',
        'seat_intake',
        'eligibility',
        'description',
        'sort_order',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'institution_id');
    }
}
