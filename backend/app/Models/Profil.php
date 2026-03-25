<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class Profil extends Model
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'matricule',
        'mot_de_passe',
        'nom',
        'role',
        'fonction',
        'telephone',
        'image'
    ];

    protected $hidden = ['mot_de_passe'];

    public function activites()
    {
        return $this->hasMany(Activite::class);
    }

    public function checkPassword($password)
    {
        return Hash::check($password, $this->mot_de_passe);
    }
}