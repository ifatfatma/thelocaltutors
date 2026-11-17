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
        Schema::create('favourite_course', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id')->default(0)->index();
            $table->unsignedBigInteger('user_id')->default(0)->index();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['user_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favourite_course');
    }
};
