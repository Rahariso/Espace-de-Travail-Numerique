<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profil extends Model
{
    protected $fillable = [
        'nom',
        'matricule',
        'role',
        'fonction',
        'telephone',
        'mot_de_passe'
    ];

    protected $hidden = [
        'mot_de_passe'
    ];

    public function activites()
    {
        return $this->hasMany(Activite::class);
    }
}