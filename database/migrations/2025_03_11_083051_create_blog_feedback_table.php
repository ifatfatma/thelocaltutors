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
        Schema::create('blog_feedback', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->default(0);
            $table->integer('blog_id')->default(0);
            $table->integer('rating')->nullable();
            $table->longText('blogfeedback')->nullable();
            $table->tinyinteger('is_active')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_feedback');
    }
};
