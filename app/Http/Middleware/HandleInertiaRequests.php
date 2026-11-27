<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\General_Setting;
use App\Models\CourseCategory;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $roleFlags = \App\Http\Middleware\EnsureUserRole::resolveRoleFlags($user);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'mobile' => $user->mobile ?? '',
                    'image' => $user->image ?? '',
                    'type' => $user->type ?? null,
                    'roles' => method_exists($user, 'roles') && $user->roles ? $user->roles->pluck('name') : [],
                    'is_admin' => $roleFlags['is_admin'],
                    'is_teacher' => $roleFlags['is_teacher'],
                    'is_student' => $roleFlags['is_student'],
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
            ],
            'userLocation' => [
                'latitude' => fn () => $request->session()->get('latitude'),
                'longitude' => fn () => $request->session()->get('longitude'),
            ],
            'settings' => function () {
                try {
                    return \Illuminate\Support\Facades\Schema::hasTable('general_settings')
                        ? General_Setting::find(1)
                        : null;
                } catch (\Throwable $e) {
                    return null;
                }
            },
            'categories' => fn () => CourseCategory::where('is_active', 1)->orderBy('title', 'asc')->get(['id', 'title', 'slug']),
            'appName' => config('app.name', 'The Local Tutors'),
            'googleMapsApiKey' => config('services.google.maps_api_key', ''),
        ];
    }
}
