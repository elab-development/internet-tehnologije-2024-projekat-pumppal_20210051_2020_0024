<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'       => 'Admin User',
            'email'      => 'admin@pumppal.com',
            'password'   => Hash::make('adminpumppal'),
            'image_url'  => 'https://careertraining.hacc.edu/common/images/2/20743/cert-admin-prof-w-office-specialist-and-voucher-935x572.jpg',
            'role'       => 'administrator',
        ]);
        // create 5 users
        User::factory()->count(5)->create();
    }
}