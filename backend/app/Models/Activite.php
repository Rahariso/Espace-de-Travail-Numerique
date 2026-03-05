<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Activite extends Model
{
    protected $fillable = [
        'nom_activite',
        'statut',
        'responsable',
        'participants',
        'commentaire',
        'date_debut',
        'date_fin'
    ];

    protected $casts = [
        'participants' => 'array',
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    // Format JSON sortie → dd/mm/yyyy
    public function getDateDebutAttribute($value)
    {
        return Carbon::parse($value)->format('d/m/Y');
    }

    public function getDateFinAttribute($value)
    {
        return Carbon::parse($value)->format('d/m/Y');
    }
}