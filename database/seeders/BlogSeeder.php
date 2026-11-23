<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $blogs = [
            [
                'title' => 'How 1-on-1 Home & Online Tutoring Transforms Academic Performance in CBSE & ICSE',
                'short_description' => 'Discover how individualized attention, customized study pacing, and real-time doubt resolution help school students overcome learning gaps and excel in board examinations.',
                'description' => '<p>In traditional classroom environments with 40 or more students, even the most attentive educators struggle to cater to individual learning paces. Many students hesitate to ask questions, leading to accumulated conceptual doubts that surface during critical examination periods.</p><h3>Why Personalized Tutoring Works</h3><p>Personalized 1-on-1 home tuition and small-batch online tutoring fundamentally shift the educational dynamic from passive listening to active engagement. A dedicated tutor observes the student’s problem-solving method in real-time, identifies underlying misconceptions, and adapts explanations to match their unique learning style.</p><ul><li><strong>Targeted Syllabus Coverage:</strong> In-depth alignment with CBSE, ICSE, and West Bengal State Board guidelines.</li><li><strong>Consistent Practice & Weekly Assessments:</strong> Regular chapter-wise tests to evaluate retention and exam readiness.</li><li><strong>Bilingual Explanation:</strong> Tutors explain complex ideas in English, Bengali, or Hindi to ensure crystal-clear comprehension.</li><li><strong>Confidence Building:</strong> A safe, supportive space to ask questions without fear of judgment.</li></ul><p>Whether preparing for Class 10 board exams or strengthening middle school foundations, having a verified, experienced local educator provides the structure and encouragement students need to thrive.</p>',
                'blog_by' => 'Academic Advisory Team',
                'blog_image' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
                'blog_cover_image' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
                'date' => $now->format('d M Y'),
                'is_active' => '1',
            ],
            [
                'title' => 'Mastering TIF Core Mathematics: Building Strong Foundations from School to Competitive Exams',
                'short_description' => 'Why conceptual clarity over rote memorization is essential for mastering mathematics, from Class 9–10 foundations to higher secondary and competitive tests.',
                'description' => '<p>Mathematics is frequently regarded as the most intimidating academic subject, yet it is also the most rewarding when taught through conceptual frameworks rather than mechanical formula memorization.</p><h3>The TIF Core Mathematics Approach</h3><p>The TIF Core Mathematics philosophy focuses on understanding the "why" behind mathematical axioms and theorems before tackling complex calculations. When a student grasps the geometric meaning of an equation or the real-world application of calculus, abstract numbers transform into intuitive tools.</p><ul><li><strong>Algebra & Number Theory:</strong> Transitioning from arithmetic thinking to general algebraic problem-solving.</li><li><strong>Geometry & Trigonometry:</strong> Visual proofs, spatial awareness, and rigorous step-by-step theorem construction.</li><li><strong>Calculus & Vectors:</strong> Class 11 and 12 preparation designed for high board exam scores and engineering entrance readiness.</li><li><strong>Speed & Mental Math:</strong> Practical shortcuts and error-reduction strategies to finish exam papers with time to spare.</li></ul><p>By pairing rigorous practice with empathetic mentoring, students not only improve their test scores by 20–35% but develop genuine intellectual confidence.</p>',
                'blog_by' => 'Mathematics Faculty',
                'blog_image' => 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
                'blog_cover_image' => 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80',
                'date' => $now->subDays(3)->format('d M Y'),
                'is_active' => '1',
            ],
            [
                'title' => 'Why Learning Artificial Intelligence & Basic Computer Skills Early Gives Students a Lifelong Advantage',
                'short_description' => 'From basic computer literacy to AI-assisted learning and introductory coding, discover how modern digital skills prepare school students for the future.',
                'description' => '<p>Digital literacy is no longer an optional extracurricular pursuit; it is foundational literacy for the 21st century. As generative AI and software tools become deeply integrated into higher education and professional workplaces, students who understand technology early gain a distinct competitive edge.</p><h3>Starting with the Essentials</h3><p>Before diving into advanced artificial intelligence, students must master foundational digital fluency: fast touch-typing, word processing, spreadsheets, internet safety, and file management. These practical competencies allow school learners to complete projects faster, organize study material, and communicate professionally.</p><ul><li><strong>Basic Computer Course:</strong> OS navigation, MS Office/Google Workspace, safe internet research, and keyboard proficiency.</li><li><strong>Logic & Algorithmic Thinking:</strong> Understanding how computers process decisions through beginner-friendly Python exercises.</li><li><strong>Artificial Intelligence Literacy:</strong> How machine learning works, prompt engineering for academic study, and ethical technology usage.</li><li><strong>Project-Based Learning:</strong> Hands-on mini-projects like building simple calculators, portfolio web pages, and automated study planners.</li></ul><p>Equipping school learners with these practical skills transforms them from passive screen consumers into creative, confident digital problem-solvers.</p>',
                'blog_by' => 'Technology & AI Mentor',
                'blog_image' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
                'blog_cover_image' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
                'date' => $now->subDays(7)->format('d M Y'),
                'is_active' => '1',
            ],
        ];

        foreach ($blogs as $blog) {
            $exists = DB::table('blogs')->where('title', $blog['title'])->whereNull('deleted_at')->exists();
            if (!$exists) {
                DB::table('blogs')->insert([
                    'title'             => $blog['title'],
                    'short_description' => $blog['short_description'],
                    'description'       => $blog['description'],
                    'blog_by'           => $blog['blog_by'],
                    'blog_image'        => $blog['blog_image'],
                    'blog_cover_image'  => $blog['blog_cover_image'],
                    'date'              => $blog['date'],
                    'is_active'         => $blog['is_active'],
                    'created_at'        => $now,
                    'updated_at'        => $now,
                ]);
            }
        }
    }
}
