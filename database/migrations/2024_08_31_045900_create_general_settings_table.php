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
        Schema::create('general_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name',192)->nullable();
            $table->string('mobile',20)->nullable();
            $table->string('logo',192)->nullable();
            $table->string('email',192)->nullable();
            $table->string('address',192)->nullable();
            $table->string('whatsapp',192)->nullable();
            $table->string('facebook',192)->nullable();
            $table->string('twitter',192)->nullable();
            $table->string('youtube',192)->nullable();
            $table->string('googleplus',192)->nullable();
            $table->string('linkedin',192)->nullable();
            $table->string('instagram',192)->nullable();
            $table->string('google_map')->nullable();
            $table->string('is_active')->default('0');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('general_settings');
    }
};
