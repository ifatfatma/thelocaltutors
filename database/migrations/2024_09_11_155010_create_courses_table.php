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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name',192)->nullable();
            $table->string('image',192)->nullable();
            $table->string('teaching_mode')->nullable();
            $table->integer('duration')->nullable();
            $table->double('price')->nullable();
            $table->integer('teacher_id')->nullable();
            $table->integer('category_id')->nullable();
            $table->longText('description')->nullable();
            $table->boolean('is_active')->default(0);
            $table->string('youtube_url',255)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
