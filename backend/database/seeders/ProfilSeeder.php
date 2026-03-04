<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profil;
use Illuminate\Support\Facades\Hash;

class ProfilSeeder extends Seeder
{
    public function run(): void
    {
        // Crée ou met à jour les profils
        Profil::updateOrCreate(
            ['numero_matricule' => 'MAT001'],
            [
                'nom' => 'RAHARISON',
                'prenom' => 'Frédéric Vestephan',
                'mot_de_passe' => Hash::make('123456'),
                'service' => 'Informatique',
                'fonction' => 'Développeur',
                'telephone' => '0340000000'
            ]
        );

        Profil::updateOrCreate(
            ['numero_matricule' => 'MAT002'],
            [
                'nom' => 'RAHARINORO',
                'prenom' => 'Alice',
                'mot_de_passe' => Hash::make('123456'),
                'service' => 'RH',
                'fonction' => 'Manager',
                'telephone' => '0341111111'
            ]
        );
    }
}