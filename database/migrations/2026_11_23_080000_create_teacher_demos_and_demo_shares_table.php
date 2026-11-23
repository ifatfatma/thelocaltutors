<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_demos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('teacher_id')->nullable();
            $table->string('title');
            $table->string('subject');
            $table->string('class_level')->nullable();
            $table->string('video_url', 1000);
            $table->string('video_embed_url', 1000)->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_feedback')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('demo_shares', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contact_id')->nullable();
            $table->unsignedBigInteger('teacher_demo_id');
            $table->string('student_name');
            $table->string('student_phone');
            $table->string('student_email')->nullable();
            $table->string('token', 64)->unique();
            $table->enum('status', ['demo_shared', 'watched', 'booking_requested'])->default('demo_shared');
            $table->timestamp('shared_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->string('preferred_schedule')->nullable();
            $table->text('student_notes')->nullable();
            $table->timestamps();

            $table->foreign('teacher_demo_id')->references('id')->on('teacher_demos')->onDelete('cascade');
            $table->foreign('contact_id')->references('id')->on('contactus')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demo_shares');
        Schema::dropIfExists('teacher_demos');
    }
};
