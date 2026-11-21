<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckInstalled
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $isInstalled = file_exists(storage_path('installed'));

        // If marked as installed, verify the database actually has the required tables
        if ($isInstalled) {
            try {
                if (!\Illuminate\Support\Facades\Schema::hasTable('users') || !\Illuminate\Support\Facades\Schema::hasTable('single_pages')) {
                    $isInstalled = false;
                    @unlink(storage_path('installed'));
                }
            } catch (\Throwable $e) {
                $isInstalled = false;
                @unlink(storage_path('installed'));
            }
        }

        if (!$isInstalled) {
            if (!$request->is('install*') && !$request->is('build*') && !$request->is('assets*')) {
                return redirect()->route('install.index');
            }
        } else {
            if ($request->is('install*') && !$request->is('install/finish')) {
                return redirect('/')->with('info', 'The application is already installed.');
            }
        }

        return $next($request);
    }
}
