<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CustomData;

class CustomDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['id' => 1, 'key_name' => 'teachmode', 'name' => 'Online', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 2, 'key_name' => 'teachmode', 'name' => 'Offline', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 3, 'key_name' => 'teachmode', 'name' => 'Both(Online & Offline)', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 4, 'key_name' => 'state', 'name' => 'West Bengal', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 5, 'key_name' => 'state', 'name' => 'Kolkata', 'parent_id' => 4, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 6, 'key_name' => 'state', 'name' => 'Kolkata', 'parent_id' => 5, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 7, 'key_name' => 'board', 'name' => 'WBBSE', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 8, 'key_name' => 'board', 'name' => 'ICSC', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 9, 'key_name' => 'board', 'name' => 'CBSC', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 10, 'key_name' => 'qualification', 'name' => 'Graduation', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 11, 'key_name' => 'qualification', 'name' => 'Master Degree', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 12, 'key_name' => 'days', 'name' => 'Monday', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 13, 'key_name' => 'subject', 'name' => 'English', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 14, 'key_name' => 'subject', 'name' => 'Math', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 15, 'key_name' => 'teacher_rating', 'name' => '1', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 16, 'key_name' => 'teacher_rating', 'name' => '2', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 17, 'key_name' => 'teacher_rating', 'name' => '3', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 18, 'key_name' => 'teacher_rating', 'name' => '4', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 19, 'key_name' => 'teacher_rating', 'name' => '5', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 20, 'key_name' => 'subject', 'name' => 'Biology', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 21, 'key_name' => 'subject', 'name' => 'Chemistry', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 22, 'key_name' => 'subject', 'name' => 'Physics', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 23, 'key_name' => 'subject', 'name' => 'Hindi', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 24, 'key_name' => 'subject', 'name' => 'Social Studies', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 25, 'key_name' => 'days', 'name' => 'Tuesday', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 26, 'key_name' => 'days', 'name' => 'Wednesday', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 27, 'key_name' => 'days', 'name' => 'Thursday', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 28, 'key_name' => 'days', 'name' => 'Friday', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 29, 'key_name' => 'days', 'name' => 'Saturday', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 30, 'key_name' => 'days', 'name' => 'Sunday', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 31, 'key_name' => 'qualification', 'name' => 'Phd', 'parent_id' => 0, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 32, 'key_name' => 'state', 'name' => 'Kolkata', 'parent_id' => 6, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 35, 'key_name' => 'state', 'name' => 'Howrah', 'parent_id' => 4, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 36, 'key_name' => 'state', 'name' => 'Alipurduar', 'parent_id' => 4, 'sorting' => 0, 'is_active' => '1'],
            ['id' => 37, 'key_name' => 'state', 'name' => 'Qasai Parah', 'parent_id' => 35, 'sorting' => 0, 'is_active' => '1'],
        ];

        foreach ($items as $item) {
            CustomData::firstOrCreate(['id' => $item['id']], $item);
        }
    }
}
