<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });
        
        Paginator::useBootstrapFive();

        // Self-healing schema check to ensure database tables in production have required columns
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('teacher_reviews') && !\Illuminate\Support\Facades\Schema::hasColumn('teacher_reviews', 'is_active')) {
                \Illuminate\Support\Facades\Schema::table('teacher_reviews', function (\Illuminate\Database\Schema\Blueprint $table) {
                    $table->tinyInteger('is_active')->default(1)->index();
                });
            }
            if (\Illuminate\Support\Facades\Schema::hasTable('courses')) {
                if (!\Illuminate\Support\Facades\Schema::hasColumn('courses', 'price_type')) {
                    \Illuminate\Support\Facades\Schema::table('courses', function (\Illuminate\Database\Schema\Blueprint $table) {
                        $table->string('price_type', 32)->default('one_time');
                    });
                }
                if (!\Illuminate\Support\Facades\Schema::hasColumn('courses', 'target_level')) {
                    \Illuminate\Support\Facades\Schema::table('courses', function (\Illuminate\Database\Schema\Blueprint $table) {
                        $table->string('target_level', 192)->nullable();
                        $table->string('educator_status', 192)->nullable();
                        $table->string('curriculum', 192)->nullable();
                    });
                }

                // Auto-format Course 2 (AI Tools) if unformatted
                $aiCourse = \Illuminate\Support\Facades\DB::table('courses')
                    ->where('id', 2)
                    ->orWhere('name', 'like', '%AI Tools%')
                    ->first();

                if ($aiCourse && (!str_contains($aiCourse->description ?? '', '<h4') || !empty($aiCourse->curriculum))) {
                    \Illuminate\Support\Facades\DB::table('courses')
                        ->where('id', $aiCourse->id)
                        ->update([
                            'description' => '<p class="lead text-dark fw-medium">Discover the power of Artificial Intelligence and learn how to use modern AI tools to make your studies smarter, faster, and more creative. This practical course introduces students to popular AI tools that help with learning, research, assignments, presentations, graphic design, content creation, and productivity.</p>' .
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
                                '</ul>',
                            'target_level' => 'Students, Beginners & Professionals',
                            'educator_status' => 'Verified Background',
                            'curriculum' => null,
                            'teaching_mode' => 'Online, Private',
                            'duration' => '40 Hours',
                        ]);
                }
            }
        } catch (\Throwable $e) {
            // Silence any schema inspection exception during initial installation or migrations
        }
    }
}
