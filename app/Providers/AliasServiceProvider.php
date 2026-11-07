<?php

namespace App\Providers;
use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\ServiceProvider;

class AliasServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $loader = AliasLoader::getInstance();

        // Add aliases
        $loader->alias('Common', \App\Http\Controllers\Common::class);
        $loader->alias('EnrollCourse', \App\Models\enrollCourse::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
