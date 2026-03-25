<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profil;
use Illuminate\Support\Facades\Hash;

class ProfilSeeder extends Seeder
{
    public function run(): void
    {
        Profil::create([
            'matricule' => 'MAT001',
            'mot_de_passe' => Hash::make('123456'),
            'nom' => 'Admin',
            'role' => 'Simple utilisateur',
            'fonction' => 'Dev',
            'telephone' => '0340000000',
        ]);

        Profil::create([
            'matricule' => 'MAT002',
            'mot_de_passe' => Hash::make('123456'),
            'nom' => 'User',
            'role' => 'Administrateur',
            'fonction' => 'Secrétaire',
            'telephone' => '0341111111',
        ]);
    }
}