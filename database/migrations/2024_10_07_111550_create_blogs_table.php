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
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('date')->nullable()->index();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->longText('short_description')->nullable();
            $table->string('blog_by')->nullable();
            $table->string('blog_image')->nullable();
            $table->string('blog_cover_image')->nullable();
            $table->string('is_active', 10)->default('1')->index();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
