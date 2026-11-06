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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->enum('gender',['Male','Female'])->nullable();
            $table->longText('description')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('experience')->nullable();
            $table->string('qualification')->nullable();
            $table->string('address')->nullable();
            $table->integer('city')->nullable();
            $table->integer('state')->nullable();
            $table->integer('district')->nullable();
            $table->integer('pincode')->nullable();
            $table->string('teaching_mode')->nullable();
            $table->string('board')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('street')->nullable();
            $table->string('block')->nullable();
            $table->string('days')->nullable();
            $table->string('subjects')->nullable();
            $table->string('timings')->nullable();
            $table->string('post_office')->nullable();
            $table->string('police_station')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
