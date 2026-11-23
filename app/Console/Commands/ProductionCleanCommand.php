<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\General_Setting;

class ProductionCleanCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:live-ready {--force : Force execution without interactive confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Safely clears dummy courses, reviews, blogs, and test teacher profiles while strictly preserving Super Admin and core system lookups.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('====================================================');
        $this->info('  THE LOCAL TUTORS - LIVE PRODUCTION DATA CLEANUP   ');
        $this->info('====================================================');

        $this->warn('SAFETY WARNING: This is a destructive cleanup for live production.');
        $this->line('The following dummy/test data will be permanently wiped:');
        $this->line('  [x] All dummy courses (courses table)');
        $this->line('  [x] All dummy course categories (course_categories table)');
        $this->line('  [x] All dummy blogs (blogs table)');
        $this->line('  [x] All test teacher profiles (teachers table)');
        $this->line('  [x] All non-admin test users (users table)');
        $this->line('  [x] All dummy reviews & testimonials (teacher_reviews, course_feedback, blog_feedback)');
        $this->line('  [x] All test inquiries & demo requests (contactus, demo_shares, teacher_demos)');
        $this->line('  [x] All test user search logs & enrollments (search, enrollcourses, favourite_course)');
        $this->line('  [x] Application cache and expired sessions');

        $this->newLine();
        $this->info('PRESERVED ESSENTIAL CORE DATA:');
        $this->info('  [✓] Super Admin Account (admin@thelocaltutors.com / 7003578764)');
        $this->info('  [✓] Roles & Permissions (Spatie system tables)');
        $this->info('  [✓] Core System Lookups (custom_data: CBSE, ICSE, WBBSE, Subjects, Modes, Qualifications)');
        $this->info('  [✓] Live General Settings (The Local Tutors / info@thelocaltutors.com)');
        $this->info('  [✓] Single Pages (About Us, Mission, Vision)');
        $this->newLine();

        if (!$this->option('force')) {
            if (!$this->confirm('Are you SURE you want to perform this live production cleanup? This cannot be undone.', false)) {
                $this->warn('Cleanup cancelled. No database records were modified.');
                return 0;
            }
        }

        $this->info('Starting database wipe of dummy records...');

        Schema::disableForeignKeyConstraints();

        // 1. Identify Super Admin to preserve
        $superAdmin = User::role('Super Admin')->first() ?? User::where('email', 'admin@thelocaltutors.com')->first();
        $adminId = $superAdmin ? $superAdmin->id : null;

        // 2. Wipe dummy teachers and non-admin users
        DB::table('teachers')->truncate();
        $this->line('  -> All dummy teacher profiles removed.');

        if ($adminId) {
            DB::table('users')->where('id', '!=', $adminId)->delete();
            $this->line('  -> All test/sample users removed (Super Admin preserved).');
        } else {
            $this->warn('  -> Super Admin not found; keeping users table intact for safety.');
        }

        // 3. Wipe dummy courses and categories
        DB::table('courses')->truncate();
        DB::table('course_categories')->truncate();
        DB::table('enrollcourses')->truncate();
        DB::table('favourite_course')->truncate();
        $this->line('  -> All dummy courses and categories removed.');

        // 4. Wipe dummy blogs
        DB::table('blogs')->truncate();
        $this->line('  -> All dummy blog posts removed.');

        // 5. Wipe dummy reviews and feedback
        DB::table('teacher_reviews')->truncate();
        DB::table('course_feedback')->truncate();
        DB::table('blog_feedback')->truncate();
        $this->line('  -> All dummy reviews, ratings, and feedback removed.');

        // 6. Wipe demo shares, teacher demos, inquiries, searches
        DB::table('demo_shares')->truncate();
        DB::table('teacher_demos')->truncate();
        DB::table('contactus')->truncate();
        DB::table('search')->truncate();
        $this->line('  -> All demo requests, inquiries, and search logs removed.');

        // 7. Verify and configure live general settings
        $settings = General_Setting::first();
        if ($settings) {
            $settings->name = 'The Local Tutors';
            $settings->email = 'info@thelocaltutors.com';
            $settings->mobile = '7003578764';
            $settings->whatsapp = '7003578764';
            $settings->address = 'Kolkata, West Bengal';
            $settings->save();
            $this->line('  -> Live General Settings confirmed.');
        }

        Schema::enableForeignKeyConstraints();

        // Clear cache and views
        $this->callSilent('cache:clear');
        $this->callSilent('config:clear');

        $this->newLine();
        $this->info('====================================================');
        $this->info('  LIVE PRODUCTION CLEANUP COMPLETED SUCCESSFULLY!   ');
        $this->info('====================================================');
        if ($superAdmin) {
            $this->info("Super Admin Login: {$superAdmin->email}");
        }

        return 0;
    }
}
