<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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
            ['title' => 'TIF Core Mathematics',   'slug' => 'tif-core-mathematics',   'description' => 'Conceptual, structured Mathematics programs from middle school to Class 11-12 & board mastery.'],
            ['title' => 'Artificial Intelligence',  'slug' => 'artificial-intelligence', 'description' => 'Hands-on AI concepts, prompt engineering, practical automation, and machine learning fundamentals.'],
            ['title' => 'Basic Computer Course',    'slug' => 'basic-computer-course',   'description' => 'Computer fundamentals, typing, MS Office, internet literacy, and digital productivity skills.'],
            ['title' => 'Science',                  'slug' => 'science',                 'description' => 'Physics, Chemistry, and Biology for CBSE, ICSE, and West Bengal State boards.'],
            ['title' => 'English Language',         'slug' => 'english-language',        'description' => 'Grammar, Literature, Spoken English, Creative Writing, and School Board preparation.'],
            ['title' => 'Commerce & Accounts',      'slug' => 'commerce-accounts',       'description' => 'Accountancy, Economics, Business Studies, and Commerce fundamentals.'],
            ['title' => 'Competitive Exams',        'slug' => 'competitive-exams',       'description' => 'NEET, JEE Main, Foundation Olympiads, and Entrance Test coaching.'],
        ];

        $catIds = [];
        foreach ($categories as $cat) {
            $existing = DB::table('course_categories')->where('slug', $cat['slug'])->first();
            if ($existing) {
                DB::table('course_categories')->where('id', $existing->id)->update([
                    'title'       => $cat['title'],
                    'description' => $cat['description'],
                    'is_active'   => '1',
                    'updated_at'  => $now,
                ]);
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
        // 2. Get a teacher user_id
        // ----------------------------------------------------------------
        $teacher = DB::table('users')->where('type', 'teacher')->first();
        $teacherId = $teacher ? $teacher->id : 1;

        // ----------------------------------------------------------------
        // 3. Flagship & Standard Courses with INR Pricing (₹1200, ₹1500, ₹2000)
        // ----------------------------------------------------------------
        $courses = [
            // TIF Core Mathematics Flagship
            [
                'name'          => 'TIF Core Mathematics (Class 9-10 Board Mastery)',
                'cat'           => 'tif-core-mathematics',
                'mode'          => 'Home / Online',
                'duration'      => 60,
                'price'         => 1500,
                'image'         => 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
                'desc'          => 'Structured conceptual curriculum covering Algebra, Geometry, Trigonometry, and Statistics. Includes weekly test series, doubt clearing, and previous 10-year board paper solutions.',
            ],
            [
                'name'          => 'TIF Higher Mathematics (Class 11-12 Calculus & Vectors)',
                'cat'           => 'tif-core-mathematics',
                'mode'          => 'Online / 1-on-1',
                'duration'      => 90,
                'price'         => 2000,
                'image'         => 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
                'desc'          => 'In-depth coverage of Differential & Integral Calculus, Matrices, Vectors, and Probability for CBSE, ISC, and competitive entrance foundations.',
            ],
            // Artificial Intelligence Flagship
            [
                'name'          => 'Artificial Intelligence & Prompt Engineering for Students',
                'cat'           => 'artificial-intelligence',
                'mode'          => 'Interactive Online',
                'duration'      => 75,
                'price'         => 2000,
                'image'         => 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
                'desc'          => 'Learn practical AI tools, intelligent search techniques, ethical AI usage, and computational logic. Hands-on projects building smart chatbots and study automations.',
            ],
            // Basic Computer Course Flagship
            [
                'name'          => 'Basic Computer Course & Essential Digital Skills',
                'cat'           => 'basic-computer-course',
                'mode'          => 'Home / Offline / Online',
                'duration'      => 60,
                'price'         => 1200,
                'image'         => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
                'desc'          => 'Master touch typing, Windows OS, MS Word, Excel spreadsheets, PowerPoint presentations, internet research, and email etiquette for school projects and daily productivity.',
            ],
            // Science
            [
                'name'          => 'Class 10 Physics & Chemistry Integrated Lab Prep',
                'cat'           => 'science',
                'mode'          => 'Home Tuition',
                'duration'      => 75,
                'price'         => 1500,
                'image'         => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
                'desc'          => 'Complete theory and numerical practice for Light, Electricity, Chemical Reactions, and Metals. Tailored for CBSE & ICSE board requirements.',
            ],
            [
                'name'          => 'Class 12 Physics & Numericals Workshop',
                'cat'           => 'science',
                'mode'          => 'Online / 1-on-1',
                'duration'      => 90,
                'price'         => 2000,
                'image'         => 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
                'desc'          => 'Electrostatics, Magnetism, Optics, and Modern Physics with extensive step-by-step numerical problem solving and formula sheets.',
            ],
            // English Language
            [
                'name'          => 'Spoken English & Communication Mastery',
                'cat'           => 'english-language',
                'mode'          => 'Interactive Online',
                'duration'      => 60,
                'price'         => 1200,
                'image'         => 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
                'desc'          => 'Overcome hesitations, improve pronunciation, expand vocabulary, and speak English fluently in school presentations, interviews, and social conversations.',
            ],
            // Commerce
            [
                'name'          => 'Class 11-12 Accountancy & Financial Accounting',
                'cat'           => 'commerce-accounts',
                'mode'          => 'Home Tuition',
                'duration'      => 75,
                'price'         => 1500,
                'image'         => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
                'desc'          => 'Ledger entries, Cash Flow, Partnership Accounts, Company Share Capital, and Balance Sheet analysis with individual attention.',
            ],
        ];

        foreach ($courses as $course) {
            $catId = $catIds[$course['cat']] ?? null;
            if (!$catId) continue;

            $existing = DB::table('courses')->where('name', $course['name'])->whereNull('deleted_at')->first();
            if ($existing) {
                DB::table('courses')->where('id', $existing->id)->update([
                    'teaching_mode' => $course['mode'],
                    'duration'      => $course['duration'],
                    'price'         => $course['price'],
                    'image'         => $course['image'],
                    'teacher_id'    => $teacherId,
                    'category_id'   => $catId,
                    'description'   => $course['desc'],
                    'is_active'     => 1,
                    'updated_at'    => $now,
                ]);
            } else {
                DB::table('courses')->insert([
                    'name'          => $course['name'],
                    'teaching_mode' => $course['mode'],
                    'duration'      => $course['duration'],
                    'price'         => $course['price'],
                    'image'         => $course['image'],
                    'teacher_id'    => $teacherId,
                    'category_id'   => $catId,
                    'description'   => $course['desc'],
                    'is_active'     => 1,
                    'created_at'    => $now,
                    'updated_at'    => $now,
                ]);
            }
        }
    }
}
