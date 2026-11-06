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
        Schema::create('custom_data', function (Blueprint $table) {
            $table->id();
            $table->string('key_name',20)->nullable();
            $table->string('name',192)->nullable();
            $table->integer('sorting')->default(0);
            $table->string('image',192)->nullable();
            $table->integer('parent_id')->default(0);
            $table->string('custom_field1',192)->nullable();
            $table->string('custom_field2',192)->nullable();
            $table->string('custom_field3',192)->nullable();
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
        Schema::dropIfExists('custom_data');
    }
};
