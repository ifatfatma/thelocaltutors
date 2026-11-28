<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Institution extends Model
{
    use HasFactory, SoftDeletes;

    public const TYPES = [
        'coaching_institute' => 'Coaching Institute',
        'school'             => 'School',
        'college'            => 'College',
        'university'         => 'University',
    ];

    public const SEARCH_TO_TYPE = [
        'coaching-center'    => 'coaching_institute',
        'coaching_institute' => 'coaching_institute',
        'schools'            => 'school',
        'school'             => 'school',
        'college'            => 'college',
        'colleges'           => 'college',
        'university'         => 'university',
        'universities'       => 'university',
    ];

    public const TYPE_TO_SEARCH = [
        'coaching_institute' => 'coaching-center',
        'school'             => 'schools',
        'college'            => 'college',
        'university'         => 'university',
    ];

    protected $fillable = [
        'user_id',
        'institution_type',
        'name',
        'slug',
        'tagline',
        'logo',
        'cover_image',
        'brochure_pdf',
        'established_year',
        'ownership_type',
        'address',
        'area',
        'city',
        'district',
        'state',
        'pincode',
        'latitude',
        'longitude',
        'phone',
        'whatsapp',
        'email',
        'website',
        'admission_status',
        'admission_process',
        'fee_range',
        'overview',
        'facilities',
        'details',
        'verification_status',
        'verified_badge',
        'is_active',
        'admin_notes',
    ];

    protected $casts = [
        'facilities'     => 'array',
        'details'        => 'array',
        'verified_badge' => 'boolean',
        'is_active'      => 'boolean',
    ];

    protected $appends = ['type_label'];

    public function getTypeLabelAttribute(): string
    {
        return self::TYPES[$this->institution_type] ?? ucfirst(str_replace('_', ' ', (string)$this->institution_type));
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function programs()
    {
        return $this->hasMany(InstitutionProgram::class, 'institution_id')->orderBy('sort_order')->orderBy('id');
    }

    public function galleries()
    {
        return $this->hasMany(InstitutionGallery::class, 'institution_id')->orderBy('sort_order')->orderBy('id');
    }

    public function inquiries()
    {
        return $this->hasMany(InstitutionInquiry::class, 'institution_id')->latest();
    }

    public function scopePubliclyVisible($query)
    {
        return $query->where('verification_status', 'approved')->where('is_active', true);
    }

    public static function resolveTypeFromSearch(?string $searchKey): ?string
    {
        if (!$searchKey) {
            return null;
        }
        return self::SEARCH_TO_TYPE[strtolower(trim($searchKey))] ?? null;
    }
}
