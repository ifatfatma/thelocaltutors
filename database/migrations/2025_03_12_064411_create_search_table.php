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
        Schema::create('search', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('lookingfor', 50)->nullable()->index();
            $table->string('state', 50)->nullable();
            $table->string('district', 50)->nullable();
            $table->string('city', 50)->nullable();
            $table->string('board', 50)->nullable();
            $table->string('subject', 50)->nullable();
            $table->string('gender', 20)->nullable();
            $table->string('radius', 20)->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('search');
    }
};
