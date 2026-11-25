<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('courses')) {
            Schema::table('courses', function (Blueprint $table) {
                if (!Schema::hasColumn('courses', 'target_level')) {
                    $table->string('target_level', 192)->nullable()->after('duration');
                }
                if (!Schema::hasColumn('courses', 'educator_status')) {
                    $table->string('educator_status', 192)->nullable()->after('target_level');
                }
                if (!Schema::hasColumn('courses', 'curriculum')) {
                    $table->string('curriculum', 192)->nullable()->after('educator_status');
                }
            });

            // Clean up any weird legacy duration defaults (e.g. '1' or '1 mins') on existing records
            DB::table('courses')
                ->where('duration', '1')
                ->orWhere('duration', '1 mins')
                ->update(['duration' => '60 mins']);

            // Format AI Tools course with structured rich HTML syllabus and clean program specifics
            $aiHtml = '<p class="lead text-dark fw-medium">Discover the power of Artificial Intelligence and learn how to use modern AI tools to make your studies smarter, faster, and more creative. This practical course introduces students to popular AI tools that help with learning, research, assignments, presentations, graphic design, content creation, and productivity.</p>' .
                '<h4>What You Will Learn</h4>' .
                '<ul>' .
                '<li><strong>ChatGPT</strong> – AI-powered learning and smart study assistance</li>' .
                '<li><strong>Google Gemini</strong> – Research, complex reasoning, and problem-solving</li>' .
                '<li><strong>Microsoft Copilot</strong> – Smart productivity, spreadsheets &amp; documents</li>' .
                '<li><strong>Canva AI</strong> – Graphic design, visual presentations, and posters</li>' .
                '<li><strong>AI Image Generation</strong> – Create professional images and concepts using text prompts</li>' .
                '<li><strong>AI for Writing</strong> – High-quality essays, reports, and structured content creation</li>' .
                '<li><strong>AI for Research</strong> – Find, verify, understand, and organize complex information</li>' .
                '<li><strong>Prompt Engineering</strong> – Master effective prompt techniques to communicate with AI</li>' .
                '</ul>' .
                '<h4>Who Can Join?</h4>' .
                '<ul>' .
                '<li>School and college students aiming to boost their study workflow</li>' .
                '<li>Graduates and job seekers preparing for future-ready careers</li>' .
                '<li>Beginners interested in exploring practical Artificial Intelligence</li>' .
                '<li>Anyone who wants to improve digital and creative productivity skills</li>' .
                '</ul>' .
                '<h4>Course Benefits</h4>' .
                '<ul>' .
                '<li>Practical hands-on training with real-world applications</li>' .
                '<li>Improve creativity and daily academic productivity</li>' .
                '<li>Learn responsible and ethical AI usage</li>' .
                '<li>Official Certificate of Completion</li>' .
                '</ul>';

            DB::table('courses')
                ->where('id', 2)
                ->orWhere('name', 'like', '%AI Tools%')
                ->update([
                    'description' => $aiHtml,
                    'target_level' => 'Students, Beginners & Professionals',
                    'educator_status' => 'Verified Background',
                    'curriculum' => null,
                    'teaching_mode' => 'Online, Private',
                    'duration' => '40 Hours',
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('courses')) {
            Schema::table('courses', function (Blueprint $table) {
                if (Schema::hasColumn('courses', 'curriculum')) {
                    $table->dropColumn('curriculum');
                }
                if (Schema::hasColumn('courses', 'educator_status')) {
                    $table->dropColumn('educator_status');
                }
                if (Schema::hasColumn('courses', 'target_level')) {
                    $table->dropColumn('target_level');
                }
            });
        }
    }
};
