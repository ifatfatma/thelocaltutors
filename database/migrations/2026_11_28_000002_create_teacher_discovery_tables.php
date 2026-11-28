<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('teacher_discovery_searches')) {
            Schema::create('teacher_discovery_searches', function (Blueprint $table) {
                $table->id();
                $table->string('country', 100)->default('India');
                $table->string('state', 120)->nullable()->index();
                $table->string('city', 120)->nullable()->index();
                $table->string('locality', 191)->nullable();
                $table->string('subject', 191)->nullable()->index();
                $table->string('teacher_type', 100)->nullable();
                $table->string('experience_filter', 60)->nullable();
                $table->string('teaching_mode', 40)->nullable(); // Online, Offline, Both
                $table->unsignedSmallInteger('max_records')->default(25);
                $table->string('search_provider', 60)->default('google_cse');
                $table->json('queries_executed')->nullable();
                $table->unsignedInteger('total_found')->default(0);
                $table->unsignedInteger('total_imported')->default(0);
                $table->unsignedInteger('total_duplicates')->default(0);
                $table->unsignedInteger('total_rejected')->default(0);
                $table->unsignedTinyInteger('progress_percent')->default(0);
                $table->string('status', 30)->default('queued')->index(); // queued, processing, completed, failed
                $table->text('error_message')->nullable();
                $table->unsignedBigInteger('created_by')->nullable()->index();
                $table->timestamp('started_at')->nullable();
                $table->timestamp('completed_at')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('teacher_discovery_results')) {
            Schema::create('teacher_discovery_results', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('search_id')->index();
                $table->string('teacher_name', 255);
                $table->string('profile_image', 500)->nullable();
                $table->string('gender', 30)->nullable();
                $table->string('email', 191)->nullable()->index();
                $table->string('phone', 40)->nullable()->index();
                $table->string('whatsapp', 40)->nullable();

                // Normalized fields for reliable deduplication
                $table->string('normalized_name', 255)->nullable()->index();
                $table->string('normalized_email', 191)->nullable()->index();
                $table->string('normalized_phone', 30)->nullable()->index();

                // Location
                $table->string('country', 100)->nullable();
                $table->string('state', 120)->nullable()->index();
                $table->string('city', 120)->nullable()->index();
                $table->string('locality', 191)->nullable();
                $table->text('full_address')->nullable();

                // Academic & Professional Info (NULL when unavailable; never guessed)
                $table->json('subjects')->nullable();
                $table->string('qualification', 255)->nullable();
                $table->string('specialization', 255)->nullable();
                $table->string('experience', 80)->nullable();
                $table->string('teaching_mode', 60)->nullable();
                $table->string('available_classes', 191)->nullable();
                $table->string('hourly_fees', 100)->nullable();
                $table->string('institute_name', 255)->nullable();
                $table->longText('biography')->nullable();

                // Source Provenance
                $table->string('source_name', 191)->nullable();
                $table->string('source_url', 500)->nullable();
                $table->char('source_url_hash', 64)->nullable()->index();
                $table->string('source_verification_status', 40)->default('unverified');
                $table->json('raw_data')->nullable();

                // Duplicate, Import & Verification Workflow
                $table->string('duplicate_status', 30)->default('unique')->index(); // unique, possible_duplicate, duplicate
                $table->string('duplicate_match_reason', 255)->nullable();
                $table->unsignedBigInteger('matched_user_id')->nullable();
                $table->string('import_status', 30)->default('pending')->index(); // pending, imported, rejected, skipped_duplicate
                $table->string('verification_status', 30)->default('pending_verification')->index(); // pending_verification, verified, rejected
                $table->unsignedBigInteger('imported_user_id')->nullable()->index();
                $table->unsignedBigInteger('imported_teacher_id')->nullable()->index();
                $table->timestamp('imported_at')->nullable();
                $table->timestamps();

                $table->foreign('search_id')
                    ->references('id')
                    ->on('teacher_discovery_searches')
                    ->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('teacher_discovery_settings')) {
            Schema::create('teacher_discovery_settings', function (Blueprint $table) {
                $table->id();
                $table->string('search_provider', 60)->default('google_cse'); // google_cse, bing, serper
                $table->unsignedSmallInteger('max_results_default')->default(25);
                $table->unsignedSmallInteger('timeout_seconds')->default(15);
                $table->unsignedTinyInteger('max_retries')->default(2);
                $table->unsignedSmallInteger('rate_limit_per_minute')->default(20);
                $table->boolean('respect_robots_txt')->default(true);
                $table->boolean('match_by_email')->default(true);
                $table->boolean('match_by_phone')->default(true);
                $table->boolean('match_by_name_city_subject')->default(true);
                $table->boolean('match_by_source_url')->default(true);
                $table->string('import_mode', 20)->default('manual'); // manual, auto
                $table->string('default_account_status', 30)->default('pending_verification'); // pending_verification, verified
                $table->unsignedSmallInteger('use_queue_above')->default(25);
                $table->timestamps();
            });
        }

        // Preserve discovery source & date on existing teachers table without duplicating teacher tables
        if (Schema::hasTable('teachers')) {
            Schema::table('teachers', function (Blueprint $table) {
                if (!Schema::hasColumn('teachers', 'discovery_source_url')) {
                    $table->string('discovery_source_url', 500)->nullable();
                }
                if (!Schema::hasColumn('teachers', 'discovery_source_name')) {
                    $table->string('discovery_source_name', 191)->nullable();
                }
                if (!Schema::hasColumn('teachers', 'discovered_at')) {
                    $table->timestamp('discovered_at')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_discovery_results');
        Schema::dropIfExists('teacher_discovery_searches');
        Schema::dropIfExists('teacher_discovery_settings');
    }
};
