<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Skip default seed users if an admin user already exists or if running from web installer
        if (User::where('type', 'admin')->exists() || (function_exists('request') && request() && request()->is('install*'))) {
            return;
        }

        // Creating Super Admin User
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@thelocaltutor.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('12345678'),
                'username' => 'superadmin',
                'type' => 'admin',
                'mobile' => '7003578764',
                'is_active' => '1'
            ]
        );
        if (!$superAdmin->hasRole('Super Admin')) {
            $superAdmin->assignRole('Super Admin');
        }

        // Creating Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@thelocaltutor.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('12345678'),
                'username' => 'admin',
                'type' => 'admin',
                'mobile' => '7003578763',
                'is_active' => '1'
            ]
        );
        if (!$admin->hasRole('Admin')) {
            $admin->assignRole('Admin');
        }

        // Creating Manager User
        $adminManager = User::firstOrCreate(
            ['email' => 'muqeet@allphptricks.com'],
            [
                'name' => 'Abdul Muqeet',
                'password' => Hash::make('muqeet1234'),
                'username' => 'manager',
                'type' => 'admin',
                'mobile' => '7002578762',
                'is_active' => '1'
            ]
        );
        if (!$adminManager->hasRole('Normal Admin')) {
            $adminManager->assignRole('Normal Admin');
        }

        // Creating Application User
        $user = User::firstOrCreate(
            ['email' => 'naghman@allphptricks.com'],
            [
                'name' => 'Naghman Ali',
                'password' => Hash::make('naghman1234'),
                'username' => 'normaluser',
                'type' => 'admin',
                'mobile' => '7003578766',
                'is_active' => '1'
            ]
        );
        if (!$user->hasRole('User')) {
            $user->assignRole('User');
        } 
    }
}
