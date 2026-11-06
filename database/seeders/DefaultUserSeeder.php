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

        
        // Creating Super Admin User
        $superAdmin = User::create([
            'name' => 'Super Admin', 
            'email' => 'superadmin@thelocaltutor.com',
            'password' => Hash::make('12345678'),
            'username'=>'superadmin',
            'type'=>'admin',
            'mobile' => '7003578764',
            'is_active'=>1
        ]);
        $superAdmin->assignRole('Super Admin');

        // Creating Admin User
        $admin = User::create([
            'name' => 'Admin User', 
            'email' => 'admin@thelocaltutor.com',
            'password' => Hash::make('12345678'),
            'username'=>'admin',
            'type'=>'admin',
            'mobile' => '7003578763',
            'is_active'=>1
        ]);
        $admin->assignRole('Admin');

        // Creating  Manager User
        $adminManager = User::create([
            'name' => 'Abdul Muqeet', 
            'email' => 'muqeet@allphptricks.com',
            'password' => Hash::make('muqeet1234'),
            'username'=>'manager',
            'type'=>'admin',
            'mobile' => '7002578762',
            'is_active'=>1
        ]);
        $adminManager->assignRole('Normal Admin');

        // Creating Application User
        $user = User::create([
            'name' => 'Naghman Ali', 
            'email' => 'naghman@allphptricks.com',
            'password' => Hash::make('naghman1234'),
            'username'=>'normaluser',
            'type'=>'admin',
            'mobile' => '7003578766',
            'is_active'=>1
        ]);
        $user->assignRole('User'); 
    }
}
