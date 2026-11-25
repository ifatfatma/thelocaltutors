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
        if (Schema::hasTable('courses') && !Schema::hasColumn('courses', 'price_type')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->string('price_type', 30)->default('one_time')->after('price')->index();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('courses') && Schema::hasColumn('courses', 'price_type')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->dropColumn('price_type');
            });
        }
    }
};
