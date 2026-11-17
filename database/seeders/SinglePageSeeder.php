<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SinglePage;

class SinglePageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'id' => 1,
                'title' => 'Our Mission',
                'description' => '<p>Connecting students with the finest passionate educators across local communities and online, fostering accessible, top-quality learning for everyone.</p>',
                'key_name' => 'ourmission',
                'is_active' => '1',
            ],
            [
                'id' => 2,
                'title' => 'Our Vision',
                'description' => '<p>To be the most trusted tutoring and mentorship platform, enabling learners to excel academically and professionally wherever they are.</p>',
                'key_name' => 'ourvision',
                'is_active' => '1',
            ],
            [
                'id' => 3,
                'title' => 'Online Learning Wherever & Whenever',
                'description' => '<p>Engage learners in active learning activities such as discussions, problem-solving exercises, or hands-on demonstrations. Encourage participation and interaction to foster deeper learning and retention.</p>',
                'key_name' => 'aboutus',
                'is_active' => '1',
            ],
            [
                'id' => 4,
                'title' => 'Build Your Career And Upgrade Your Life',
                'description' => '<p>Provide quality mentorship and comprehensive resources for learners who want to explore topics further, mastering curriculum and achieving top results.</p>',
                'key_name' => 'subaboutus',
                'is_active' => '1',
            ],
            [
                'id' => 5,
                'title' => 'Want to share your knowledge? Join us as a Mentor Now!',
                'description' => '<p>Provide personalized guidance and inspire students across various subjects and boards. Share your expertise and grow your tutoring practice.</p>',
                'key_name' => 'becomeamentor',
                'is_active' => '1',
            ],
        ];

        foreach ($pages as $p) {
            SinglePage::firstOrCreate(['id' => $p['id']], $p);
        }
    }
}
