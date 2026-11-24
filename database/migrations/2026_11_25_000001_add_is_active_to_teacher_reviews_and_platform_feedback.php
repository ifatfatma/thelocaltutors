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
        // 1. Add is_active column to teacher_reviews if not exists
        if (Schema::hasTable('teacher_reviews') && !Schema::hasColumn('teacher_reviews', 'is_active')) {
            Schema::table('teacher_reviews', function (Blueprint $table) {
                $table->tinyInteger('is_active')->default(1)->after('teacher_rating')->index();
            });
        }

        // 2. Create platform_feedback table if not exists
        if (!Schema::hasTable('platform_feedback')) {
            Schema::create('platform_feedback', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->nullable()->index();
                $table->string('name')->nullable();
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
                $table->string('role', 100)->nullable();
                $table->string('category', 100)->nullable();
                $table->integer('rating')->default(5);
                $table->text('feedback');
                $table->tinyInteger('is_active')->default(0)->index();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        // 3. Ensure courses.duration can hold string values (e.g., '3 months', '6 weeks')
        if (Schema::hasTable('courses') && Schema::hasColumn('courses', 'duration')) {
            try {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE `courses` MODIFY `duration` VARCHAR(191) NULL");
            } catch (\Throwable $e) {
                // Ignore if already varchar
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('teacher_reviews') && Schema::hasColumn('teacher_reviews', 'is_active')) {
            Schema::table('teacher_reviews', function (Blueprint $table) {
                $table->dropColumn('is_active');
            });
        }

        Schema::dropIfExists('platform_feedback');
    }
};
