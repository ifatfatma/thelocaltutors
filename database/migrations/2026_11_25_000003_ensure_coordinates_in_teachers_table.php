<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('teachers')) {
            Schema::table('teachers', function (Blueprint $table) {
                if (!Schema::hasColumn('teachers', 'latitude')) {
                    $table->decimal('latitude', 10, 8)->nullable()->index()->after('board');
                }
                if (!Schema::hasColumn('teachers', 'longitude')) {
                    $table->decimal('longitude', 11, 8)->nullable()->index()->after('latitude');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('teachers')) {
            Schema::table('teachers', function (Blueprint $table) {
                // Keep columns safe on rollback
            });
        }
    }
};
