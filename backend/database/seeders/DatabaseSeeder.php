<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crée ou met à jour l'utilisateur
        User::updateOrCreate(
            ['email' => 'test@example.com'], // clé unique
            [
                'name' => 'Test User',
                'password' => Hash::make('123456'),
            ]
        );
        
         $this->call([
        ProfilSeeder::class,
        ActiviteSeeder::class,
    ]);
    }
}
