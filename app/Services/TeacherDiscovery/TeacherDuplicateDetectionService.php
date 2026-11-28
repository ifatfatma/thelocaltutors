<?php

namespace App\Services\TeacherDiscovery;

use App\Models\TeacherDiscoveryResult;
use App\Models\TeacherDiscoverySetting;
use App\Models\User;

class TeacherDuplicateDetectionService
{
    public static function normalizeName(?string $name): ?string
    {
        if (!$name) return null;
        $clean = strtolower(trim($name));
        $clean = preg_replace('/^(dr|prof|mr|mrs|ms|miss|sir|madam)\.?\s+/i', '', $clean);
        $clean = preg_replace('/[^a-z0-9\s]/', '', $clean);
        return trim(preg_replace('/\s+/', ' ', $clean)) ?: null;
    }

    public static function normalizeEmail(?string $email): ?string
    {
        if (!$email) return null;
        $clean = strtolower(trim($email));
        return filter_var($clean, FILTER_VALIDATE_EMAIL) ? $clean : null;
    }

    public static function normalizePhone(?string $phone): ?string
    {
        if (!$phone) return null;
        $digits = preg_replace('/\D/', '', $phone);
        if (strlen($digits) > 10) {
            $digits = substr($digits, -10);
        }
        return strlen($digits) >= 10 ? $digits : null;
    }

    /**
     * Detect duplicates against existing users/teachers and prior discovery results.
     *
     * @return array{
     *   normalized_name: ?string,
     *   normalized_email: ?string,
     *   normalized_phone: ?string,
     *   duplicate_status: string,
     *   duplicate_match_reason: ?string,
     *   matched_user_id: ?int
     * }
     */
    public function detect(array $data, TeacherDiscoverySetting $settings, ?int $excludeResultId = null): array
    {
        $normName = self::normalizeName($data['teacher_name'] ?? null);
        $normEmail = self::normalizeEmail($data['email'] ?? null);
        $normPhone = self::normalizePhone($data['phone'] ?? null);
        $urlHash = $data['source_url_hash'] ?? (!empty($data['source_url']) ? hash('sha256', rtrim(strtolower($data['source_url']), '/')) : null);

        $status = 'unique';
        $reason = null;
        $matchedUserId = null;

        // 1. Email match against existing users
        if ($settings->match_by_email && $normEmail) {
            $user = User::whereRaw('LOWER(email) = ?', [$normEmail])->first();
            if ($user) {
                $status = 'duplicate';
                $reason = "Exact email match with existing account (#{$user->id})";
                $matchedUserId = $user->id;
            }
        }

        // 2. Mobile match against existing users
        if ($status === 'unique' && $settings->match_by_phone && $normPhone) {
            $user = User::where('mobile', $normPhone)
                ->orWhere('mobile', 'LIKE', "%{$normPhone}")
                ->first();
            if ($user) {
                $status = 'duplicate';
                $reason = "Exact mobile number match with existing account (#{$user->id})";
                $matchedUserId = $user->id;
            }
        }

        // 3. Source URL match against existing discovery results or imported teachers
        if ($status === 'unique' && $settings->match_by_source_url && $urlHash) {
            $prevResult = TeacherDiscoveryResult::where('source_url_hash', $urlHash)
                ->when($excludeResultId, fn ($q) => $q->where('id', '!=', $excludeResultId))
                ->first();
            if ($prevResult) {
                $status = 'duplicate';
                $reason = "Source profile URL already discovered (Result #{$prevResult->id})";
                $matchedUserId = $prevResult->imported_user_id;
            }
        }

        // 4. Name + City + Subject match against existing teachers
        if ($status === 'unique' && $settings->match_by_name_city_subject && $normName && !empty($data['city'])) {
            $city = trim((string)$data['city']);
            $existingTeacher = User::where('type', 'teacher')
                ->whereRaw('LOWER(name) = ?', [$normName])
                ->whereHas('teachermore', function ($q) use ($city) {
                    $q->where('city', 'LIKE', "%{$city}%");
                })
                ->first();

            if ($existingTeacher) {
                $status = 'possible_duplicate';
                $reason = "Name & city match with existing teacher (#{$existingTeacher->id})";
                $matchedUserId = $existingTeacher->id;
            }
        }

        return [
            'normalized_name'        => $normName,
            'normalized_email'       => $normEmail,
            'normalized_phone'       => $normPhone,
            'duplicate_status'       => $status,
            'duplicate_match_reason' => $reason,
            'matched_user_id'        => $matchedUserId,
        ];
    }
}
