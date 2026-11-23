<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherDemo extends Model
{
    use HasFactory;

    protected $table = 'teacher_demos';

    protected $fillable = [
        'user_id',
        'teacher_id',
        'title',
        'subject',
        'class_level',
        'video_url',
        'video_embed_url',
        'notes',
        'status',
        'admin_feedback',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function shares()
    {
        return $this->hasMany(DemoShare::class, 'teacher_demo_id');
    }

    /**
     * Helper to normalize YouTube or Google Drive URLs into embeddable iframe URLs
     */
    public static function convertToEmbedUrl(?string $url): ?string
    {
        if (empty($url)) {
            return null;
        }

        $url = trim($url);

        // YouTube: standard watch?v=...
        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i', $url, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1] . '?rel=0&modestbranding=1';
        }

        // Google Drive: file/d/{id}/view -> file/d/{id}/preview
        if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i', $url, $matches)) {
            return 'https://drive.google.com/file/d/' . $matches[1] . '/preview';
        }

        // Google Drive: open?id={id}
        if (preg_match('/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i', $url, $matches)) {
            return 'https://drive.google.com/file/d/' . $matches[1] . '/preview';
        }

        // Already an embed URL or generic
        return $url;
    }
}
