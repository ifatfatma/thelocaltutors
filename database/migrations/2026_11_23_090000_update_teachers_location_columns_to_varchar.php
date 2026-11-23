<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Alter state, district, city in teachers table to VARCHAR(191) to support Pan-India names and IDs
        DB::statement('ALTER TABLE teachers MODIFY state VARCHAR(191) NULL, MODIFY district VARCHAR(191) NULL, MODIFY city VARCHAR(191) NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to bigint if needed
        DB::statement('ALTER TABLE teachers MODIFY state BIGINT UNSIGNED NULL, MODIFY district BIGINT UNSIGNED NULL, MODIFY city BIGINT UNSIGNED NULL');
    }
};
