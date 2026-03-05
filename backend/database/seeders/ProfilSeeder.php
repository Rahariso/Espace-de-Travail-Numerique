<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profil;
use Illuminate\Support\Facades\Hash;

class ProfilSeeder extends Seeder
{
    public function run(): void
    {
        Profil::updateOrCreate(
            ['matricule' => 'MAT001'],
            [
                'nom' => 'RAHARISON',
                'role' => 'Administrateur',
                'fonction' => 'Développeur',
                'telephone' => '0340000000',
                'mot_de_passe' => Hash::make('123456')
            ]
        );

        Profil::updateOrCreate(
            ['matricule' => 'MAT002'],
            [
                'nom' => 'RAKOTO',
                'role' => 'Utilisateur',
                'fonction' => 'Secrétaire',
                'telephone' => '0341111111',
                'mot_de_passe' => Hash::make('123456')
            ]
        );
    }
}