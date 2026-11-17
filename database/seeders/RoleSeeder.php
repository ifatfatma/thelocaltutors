<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $normalAdmin = Role::firstOrCreate(['name' => 'Normal Admin']);
        $user = Role::firstOrCreate(['name' => 'User']);

        $admin->syncPermissions([
            'create-user',
            'edit-user',
            'delete-user',
            'create-teacher',
            'edit-teacher',
            'delete-teacher'
        ]);

        $normalAdmin->syncPermissions([
            'create-teacher',
            'edit-teacher',
            'delete-teacher'
        ]);

        $user->syncPermissions([
            'view-teacher'
        ]);
    }
}
