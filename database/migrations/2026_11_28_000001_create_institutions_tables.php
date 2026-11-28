<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('institutions')) {
            Schema::create('institutions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->nullable()->index();
                $table->string('institution_type', 40)->index(); // coaching_institute, school, college, university
                $table->string('name', 255);
                $table->string('slug', 255)->unique();
                $table->string('tagline', 255)->nullable();

                // Media & Brochure
                $table->string('logo', 255)->nullable();
                $table->string('cover_image', 255)->nullable();
                $table->string('brochure_pdf', 255)->nullable();

                // Core Organization Details
                $table->unsignedSmallInteger('established_year')->nullable();
                $table->string('ownership_type', 60)->nullable(); // Government, Private, Trust, Aided, Public-Private

                // Location & Google Maps Radius Search
                $table->text('address')->nullable();
                $table->string('area', 191)->nullable();
                $table->string('city', 120)->nullable()->index();
                $table->string('district', 120)->nullable();
                $table->string('state', 120)->nullable()->index();
                $table->string('pincode', 20)->nullable();
                $table->decimal('latitude', 10, 7)->nullable()->index();
                $table->decimal('longitude', 10, 7)->nullable()->index();

                // Official Contact
                $table->string('phone', 40)->nullable();
                $table->string('whatsapp', 40)->nullable();
                $table->string('email', 191)->nullable();
                $table->string('website', 255)->nullable();

                // Admissions & Overview
                $table->string('admission_status', 30)->default('open')->index(); // open, closed, upcoming
                $table->longText('admission_process')->nullable();
                $table->string('fee_range', 191)->nullable();
                $table->longText('overview')->nullable();

                // Structured Facilities & Category-Specific Details
                $table->json('facilities')->nullable();
                $table->json('details')->nullable();

                // Dual-Ownership Approval & Visibility Flags
                $table->string('verification_status', 20)->default('pending')->index(); // pending, approved, rejected
                $table->boolean('verified_badge')->default(false);
                $table->boolean('is_active')->default(true)->index();
                $table->text('admin_notes')->nullable();

                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (!Schema::hasTable('institution_programs')) {
            Schema::create('institution_programs', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('institution_id')->index();
                $table->string('title', 255);
                $table->string('level', 100)->nullable(); // e.g., UG, PG, PhD, Class 11-12, Foundation, Target Batch
                $table->string('duration', 100)->nullable(); // e.g., 1 Year, 4 Years, 6 Months
                $table->string('mode', 80)->nullable(); // Offline, Online, Hybrid, Full-Time
                $table->string('fee_amount', 120)->nullable(); // e.g., ₹45,000 / year
                $table->string('seat_intake', 80)->nullable();
                $table->string('eligibility', 255)->nullable();
                $table->text('description')->nullable();
                $table->integer('sort_order')->default(0);
                $table->timestamps();

                $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('institution_galleries')) {
            Schema::create('institution_galleries', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('institution_id')->index();
                $table->string('image_path', 255);
                $table->string('caption', 255)->nullable();
                $table->string('category', 80)->nullable(); // Campus, Classroom, Lab, Library, Events, Hostel
                $table->integer('sort_order')->default(0);
                $table->timestamps();

                $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('institution_inquiries')) {
            Schema::create('institution_inquiries', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('institution_id')->index();
                $table->unsignedBigInteger('user_id')->nullable()->index();
                $table->string('student_name', 191);
                $table->string('student_email', 191)->nullable();
                $table->string('student_phone', 40);
                $table->string('program_interest', 191)->nullable();
                $table->text('message')->nullable();
                $table->string('status', 30)->default('new')->index(); // new, contacted, closed
                $table->timestamps();

                $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('institution_inquiries');
        Schema::dropIfExists('institution_galleries');
        Schema::dropIfExists('institution_programs');
        Schema::dropIfExists('institutions');
    }
};
