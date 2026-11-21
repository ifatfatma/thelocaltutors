<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CourseCategoryAndCourseSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // ----------------------------------------------------------------
        // 1. Insert Course Categories
        // ----------------------------------------------------------------
        $categories = [
            ['title' => 'Mathematics',       'slug' => 'mathematics',       'description' => 'All levels of Mathematics from school to competitive exams.'],
            ['title' => 'Science',            'slug' => 'science',            'description' => 'Physics, Chemistry, Biology for CBSE, ICSE & WBBSE boards.'],
            ['title' => 'English Language',   'slug' => 'english-language',   'description' => 'Grammar, Literature, Spoken English & Writing Skills.'],
            ['title' => 'Computer Science',   'slug' => 'computer-science',   'description' => 'Coding, Web Development, Python, Java & IT courses.'],
            ['title' => 'Commerce & Accounts','slug' => 'commerce-accounts',  'description' => 'Accountancy, Economics, Business Studies & Finance.'],
            ['title' => 'Competitive Exams',  'slug' => 'competitive-exams',  'description' => 'NEET, JEE, SSC, Banking & Government exam preparation.'],
        ];

        $catIds = [];
        foreach ($categories as $cat) {
            $existing = DB::table('course_categories')->where('slug', $cat['slug'])->first();
            if ($existing) {
                $catIds[$cat['slug']] = $existing->id;
            } else {
                $id = DB::table('course_categories')->insertGetId([
                    'title'       => $cat['title'],
                    'slug'        => $cat['slug'],
                    'description' => $cat['description'],
                    'is_active'   => '1',
                    'created_at'  => $now,
                    'updated_at'  => $now,
                ]);
                $catIds[$cat['slug']] = $id;
            }
        }

        // ----------------------------------------------------------------
        // 2. Get a teacher user_id to assign courses to
        // ----------------------------------------------------------------
        $teacher = DB::table('users')->where('type', 'teacher')->first();
        $teacherId = $teacher ? $teacher->id : null;

        // ----------------------------------------------------------------
        // 3. Insert Courses
        // ----------------------------------------------------------------
        $courses = [
            // Mathematics
            ['name' => 'Class 10 Mathematics (CBSE)',     'slug' => 'class-10-mathematics-cbse',  'cat' => 'mathematics',        'mode' => 'Online',      'duration' => 90, 'price' => 1500, 'desc' => 'Complete CBSE Class 10 Maths with solved examples and board exam tips.'],
            ['name' => 'JEE Mathematics Crash Course',    'slug' => 'jee-mathematics-crash-course','cat' => 'mathematics',        'mode' => 'Online',      'duration' => 120,'price' => 3999, 'desc' => 'Intensive JEE Main & Advanced Mathematics preparation.'],
            ['name' => 'Class 6–8 Maths Foundation',      'slug' => 'class-6-8-maths-foundation', 'cat' => 'mathematics',        'mode' => 'Home Tuition','duration' => 60, 'price' => 800,  'desc' => 'Build strong fundamentals in Mathematics for middle school students.'],
            // Science
            ['name' => 'Class 12 Physics (CBSE/WBBSE)',   'slug' => 'class-12-physics',           'cat' => 'science',            'mode' => 'Online',      'duration' => 90, 'price' => 1800, 'desc' => 'Comprehensive Class 12 Physics with numericals and board exam strategy.'],
            ['name' => 'NEET Biology Preparation',         'slug' => 'neet-biology-preparation',   'cat' => 'science',            'mode' => 'Online',      'duration' => 150,'price' => 4999, 'desc' => 'Full NEET Biology syllabus with MCQ practice and mock tests.'],
            ['name' => 'Class 10 Chemistry (ICSE)',        'slug' => 'class-10-chemistry-icse',    'cat' => 'science',            'mode' => 'Home Tuition','duration' => 75, 'price' => 1200, 'desc' => 'ICSE Class 10 Chemistry with lab work, diagrams and board prep.'],
            // English
            ['name' => 'Spoken English for Beginners',    'slug' => 'spoken-english-beginners',   'cat' => 'english-language',   'mode' => 'Online',      'duration' => 45, 'price' => 999,  'desc' => 'Build confidence and fluency in spoken English from scratch.'],
            ['name' => 'English Grammar Mastery',         'slug' => 'english-grammar-mastery',    'cat' => 'english-language',   'mode' => 'Online',      'duration' => 60, 'price' => 799,  'desc' => 'Master English grammar rules, tenses, comprehension and essay writing.'],
            // Computer Science
            ['name' => 'Python Programming – Beginner',   'slug' => 'python-programming-beginner','cat' => 'computer-science',   'mode' => 'Online',      'duration' => 90, 'price' => 2499, 'desc' => 'Learn Python programming from scratch with hands-on projects.'],
            ['name' => 'Web Development Bootcamp',        'slug' => 'web-development-bootcamp',   'cat' => 'computer-science',   'mode' => 'Online',      'duration' => 180,'price' => 5999, 'desc' => 'HTML, CSS, JavaScript, PHP, MySQL – full stack web development course.'],
            // Commerce
            ['name' => 'Class 11 Accountancy (CBSE)',     'slug' => 'class-11-accountancy-cbse',  'cat' => 'commerce-accounts',  'mode' => 'Home Tuition','duration' => 60, 'price' => 1000, 'desc' => 'CBSE Class 11 Accountancy with journal entries, ledger and trial balance.'],
            ['name' => 'Economics for Class 12',          'slug' => 'economics-class-12',         'cat' => 'commerce-accounts',  'mode' => 'Online',      'duration' => 75, 'price' => 1200, 'desc' => 'Micro and Macro Economics for Class 12 CBSE with case study practice.'],
            // Competitive
            ['name' => 'NEET Full Course (PCB)',           'slug' => 'neet-full-course-pcb',       'cat' => 'competitive-exams',  'mode' => 'Online',      'duration' => 365,'price' => 9999, 'desc' => 'Complete NEET preparation covering Physics, Chemistry and Biology.'],
            ['name' => 'SSC CGL Exam Preparation',        'slug' => 'ssc-cgl-exam-preparation',   'cat' => 'competitive-exams',  'mode' => 'Online',      'duration' => 120,'price' => 2999, 'desc' => 'SSC CGL Tier I & II – Quant, Reasoning, English & GK full coverage.'],
        ];

        foreach ($courses as $course) {
            $catId = $catIds[$course['cat']] ?? null;
            if (!$catId) continue;

            $exists = DB::table('courses')
                ->where('name', $course['name'])
                ->whereNull('deleted_at')
                ->exists();

            if (!$exists) {
                DB::table('courses')->insert([
                    'name'          => $course['name'],
                    'teaching_mode' => $course['mode'],
                    'duration'      => $course['duration'],
                    'price'         => $course['price'],
                    'teacher_id'    => $teacherId,
                    'category_id'   => $catId,
                    'description'   => $course['desc'],
                    'is_active'     => 1,
                    'created_at'    => $now,
                    'updated_at'    => $now,
                ]);
            }
        }

        $this->command->info('✅ Seeded ' . count($categories) . ' categories and ' . count($courses) . ' courses successfully!');
    }
}
