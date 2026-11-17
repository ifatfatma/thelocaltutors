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
        Schema::create('course_feedback', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->default(0)->index();
            $table->unsignedBigInteger('course_id')->default(0)->index();
            $table->integer('rating')->nullable();
            $table->longText('feedback')->nullable();
            $table->tinyInteger('is_active')->default(1)->index();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['course_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_feedback');
    }
};
