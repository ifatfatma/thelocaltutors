<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CheckInstalled
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $installedFile = storage_path('installed');
        $hasInstalledFile = file_exists($installedFile);
        $hasEnvFlag = filter_var(env('APP_INSTALLED', false), FILTER_VALIDATE_BOOLEAN);

        // Check if database is already configured and migrated with existing tables
        $dbHasTables = false;
        try {
            if (DB::connection()->getPdo() && Schema::hasTable('users')) {
                $dbHasTables = true;
                // If database tables exist but storage/installed is missing (e.g. after git push/deploy),
                // safely restore the lock file so the live application never prompts for re-installation
                if (!$hasInstalledFile) {
                    @file_put_contents($installedFile, json_encode([
                        'installed_at' => now()->toIso8601String(),
                        'auto_restored' => true,
                    ], JSON_PRETTY_PRINT));
                    $hasInstalledFile = true;
                }
            }
        } catch (\Throwable $e) {
            // Do NOT delete storage/installed on connection hiccups or temporary database glitches
        }

        $isInstalled = $hasInstalledFile || $hasEnvFlag || $dbHasTables;

        if (!$isInstalled) {
            if (!$request->is('install*') && !$request->is('build*') && !$request->is('assets*')) {
                return redirect()->route('install.index');
            }
        } else {
            // Application is installed: protect existing data by blocking installer routes
            if ($request->is('install*') && !$request->is('install/finish')) {
                return redirect('/')->with('info', 'The application is already installed.');
            }
        }

        return $next($request);
    }
}
