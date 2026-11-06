<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'create-role',
            'edit-role',
            'delete-role',
            'create-user',
            'edit-user',
            'delete-user',
            'view-teacher',
            'create-teacher',
            'edit-teacher',
            'delete-teacher',
            'view-customdata',
            'create-customdata',
            'edit-customdata',
            'delete-customdata',
            'view-blog',
            'create-blog',
            'edit-blog',
            'delete-blog',
            'view-faq',
            'create-faq',
            'edit-faq',
            'delete-faq',
            'view-course-category',
            'create-course-category',
            'edit-course-category',
            'delete-course-category',
            'view-course',
            'create-course',
            'edit-course',
            'delete-course',
            'view-state-city-area',
            'create-state-city-area',
            'edit-state-city-area',
            'delete-state-city-area',
            'view-board',
            'create-board',
            'edit-board',
            'delete-board',
            'view-qualification',
            'create-qualification',
            'edit-qualification',
            'delete-qualification',
            'view-teaching-mode',
            'create-teaching-mode',
            'edit-teaching-mode',
            'delete-teaching-mode',        
            'view-days',
            'create-days',
            'edit-days',
            'delete-days',
            'view-subject',
            'create-subject',
            'edit-subject',
            'delete-subject',
            'view-ratings',
            'create-ratings',
            'edit-ratings',
            'delete-ratings',
            'view-setting',
            'create-setting',
            'edit-setting',
            'delete-setting',
            'view-single-page',
            'create-single-page',
            'edit-single-page',
            'delete-single-page'
         ];
 
          // Looping and Inserting Array's Permissions into Permission Table
         foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
          }
    }
}
