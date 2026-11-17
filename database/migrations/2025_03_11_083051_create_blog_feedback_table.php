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
            $table->unsignedBigInteger('user_id')->default(0)->index();
            $table->unsignedBigInteger('blog_id')->default(0)->index();
            $table->integer('rating')->nullable();
            $table->longText('blogfeedback')->nullable();
            $table->tinyInteger('is_active')->default(1)->index();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['blog_id', 'is_active']);
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
