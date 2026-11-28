<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * Usage: ->middleware('user_role:teacher,admin') or ->middleware('user_role:admin')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('front.login');
        }

        if (!self::userHasAnyRole($user, $roles)) {
            $message = 'Access denied. You do not have permission to access this resource.';
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json(['success' => false, 'message' => $message], 403);
            }
            abort(403, $message);
        }

        return $next($request);
    }

    /**
     * Centralized role evaluator supporting both users.type and Spatie roles.
     */
    public static function resolveRoleFlags($user): array
    {
        if (!$user) {
            return [
                'is_admin'       => false,
                'is_teacher'     => false,
                'is_institution' => false,
                'is_student'     => false,
            ];
        }

        $type = strtolower(trim((string)($user->type ?? '')));
        $spatieRoles = [];

        if (method_exists($user, 'getRoleNames')) {
            try {
                $spatieRoles = $user->getRoleNames()
                    ->map(fn ($r) => strtolower(trim((string)$r)))
                    ->toArray();
            } catch (\Throwable $e) {
                $spatieRoles = [];
            }
        }

        $isAdmin = ($type === 'admin')
            || in_array('admin', $spatieRoles, true)
            || in_array('super admin', $spatieRoles, true);

        $institutionTypes = ['institution', 'coaching_institute', 'school', 'college', 'university'];
        $isInstitution = !$isAdmin && (in_array($type, $institutionTypes, true) || in_array('institution', $spatieRoles, true));
        $isTeacher = !$isAdmin && !$isInstitution && (($type === 'teacher') || in_array('teacher', $spatieRoles, true));
        $isStudent = !$isAdmin && !$isInstitution && !$isTeacher;

        return [
            'is_admin'       => $isAdmin,
            'is_teacher'     => $isTeacher,
            'is_institution' => $isInstitution,
            'is_student'     => $isStudent,
        ];
    }

    /**
     * Check if user matches any of the allowed role names.
     */
    public static function userHasAnyRole($user, array $allowedRoles): bool
    {
        $flags = self::resolveRoleFlags($user);

        foreach ($allowedRoles as $role) {
            $r = strtolower(trim($role));
            if ($r === 'admin' && $flags['is_admin']) {
                return true;
            }
            if ($r === 'teacher' && $flags['is_teacher']) {
                return true;
            }
            if ($r === 'institution' && $flags['is_institution']) {
                return true;
            }
            if ($r === 'student' && $flags['is_student']) {
                return true;
            }
        }

        return false;
    }
}
