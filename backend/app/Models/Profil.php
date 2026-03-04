<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profil extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'numero_matricule',
        'mot_de_passe',
        'service',
        'fonction',
        'telephone'
    ];

    public function activites()
    {
        return $this->hasMany(Activite::class);
    }
}