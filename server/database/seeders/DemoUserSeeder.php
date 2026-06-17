<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'demo@example.com'],
            [
                'username' => 'DemoUser',
                'password' => Hash::make('DemoPassword123'),
                'email_verified_at' => now(),
                'is_demo' => true,
            ],
        );
    }
}
