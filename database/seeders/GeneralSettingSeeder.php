<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\General_Setting;
class GeneralSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        General_Setting::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'The Local Tutors', 
                'email' => 'info@thelocaltutors.com',
                'is_active' => '1',
            ]
        );
    }
}
