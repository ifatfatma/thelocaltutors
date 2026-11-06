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
       // Creating Super Admin User
       $superAdmin = General_Setting::create([
        'name' => 'The Local Tutors', 
        'email' => 'info@thelocaltutors.com'
    ]);
    }
}
