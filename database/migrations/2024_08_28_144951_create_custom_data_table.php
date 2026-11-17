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
            $table->string('key_name', 50)->nullable()->index();
            $table->string('name', 192)->nullable();
            $table->integer('sorting')->default(0)->index();
            $table->string('image', 192)->nullable();
            $table->unsignedBigInteger('parent_id')->default(0)->index();
            $table->string('custom_field1', 192)->nullable();
            $table->string('custom_field2', 192)->nullable();
            $table->string('custom_field3', 192)->nullable();
            $table->string('is_active', 10)->default('1')->index();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['key_name', 'parent_id']);
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
