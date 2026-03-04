<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Activite extends Model
{
    protected $fillable = [
        'reference',
        'description',
        'pta',
        'bailleur',
        'date_debut',
        'date_fin',
        'profil_id'
    ];

    // Indique à Laravel que ce sont des dates
    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    // FORMAT SORTIE JSON → dd/mm/yyyy
    public function getDateDebutAttribute($value)
    {
        return Carbon::parse($value)->format('d/m/Y');
    }

    public function getDateFinAttribute($value)
    {
        return Carbon::parse($value)->format('d/m/Y');
    }

    public function profil()
    {
        return $this->belongsTo(Profil::class);
    }
}