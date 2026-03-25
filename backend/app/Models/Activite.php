<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activite extends Model
{
    protected $fillable = [
        'nom_activite',
        'statut',
        'responsable',
        'participants',
        'commentaire',
        'date_debut',
        'date_fin',
        'profil_id',
    ];

    protected $casts = [
        'participants' => 'array',
        'date_debut' => 'date:Y-m-d',
        'date_fin' => 'date:Y-m-d',
    ];

    public function profil()
    {
        return $this->belongsTo(Profil::class);
    }
}
