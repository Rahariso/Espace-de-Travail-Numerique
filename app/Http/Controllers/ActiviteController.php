<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ActiviteController extends Controller
{
    public function index()
    {
        return response()->json(
            Activite::query()
                ->select([
                    'id',
                    'nom_activite',
                    'statut',
                    'responsable',
                    'participants',
                    'commentaire',
                    'date_debut',
                    'date_fin',
                    'profil_id',
                    'created_at',
                    'updated_at',
                ])
                ->orderByDesc('updated_at')
                ->get(),
            200
        );
    }

    public function show($id)
    {
        $activite = Activite::query()
            ->select([
                'id',
                'nom_activite',
                'statut',
                'responsable',
                'participants',
                'commentaire',
                'date_debut',
                'date_fin',
                'profil_id',
                'created_at',
                'updated_at',
            ])
            ->findOrFail($id);

        return response()->json($activite, 200);
    }

    public function store(Request $request)
    {
        $request->merge([
            'date_debut' => $this->normalizeDate($request->date_debut),
            'date_fin' => $this->normalizeDate($request->date_fin),
        ]);

        $request->validate([
            'nom_activite' => 'required|string',
            'statut' => 'required|string',
            'responsable' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'profil_id' => 'required|exists:profils,id',
            'participants' => 'nullable|array',
            'participants.*' => 'string',
            'commentaire' => 'nullable|string',
        ]);

        $activite = Activite::create([
            'nom_activite' => $request->nom_activite,
            'statut' => $request->statut,
            'responsable' => $request->responsable,
            'participants' => $request->participants ?? [],
            'commentaire' => $request->commentaire,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'profil_id' => $request->profil_id,
        ]);

        return response()->json($activite, 201);
    }

    public function update(Request $request, $id)
    {
        $activite = Activite::findOrFail($id);

        $request->merge([
            'date_debut' => $this->normalizeDate($request->date_debut),
            'date_fin' => $this->normalizeDate($request->date_fin),
        ]);

        $request->validate([
            'nom_activite' => 'required|string',
            'statut' => 'required|string',
            'responsable' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'profil_id' => 'required|exists:profils,id',
            'participants' => 'nullable|array',
            'participants.*' => 'string',
            'commentaire' => 'nullable|string',
        ]);

        $activite->update([
            'nom_activite' => $request->nom_activite,
            'statut' => $request->statut,
            'responsable' => $request->responsable,
            'participants' => $request->participants ?? [],
            'commentaire' => $request->commentaire,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'profil_id' => $request->profil_id,
        ]);

        return response()->json($activite, 200);
    }

    public function destroy(Request $request, $id)
    {
        $activite = Activite::findOrFail($id);
        $activite->delete();

        return response()->json([
            'message' => 'Activite supprimee',
        ], 200);
    }

    public function search($keyword)
    {
        $activites = Activite::query()
            ->select([
                'id',
                'nom_activite',
                'statut',
                'responsable',
                'participants',
                'commentaire',
                'date_debut',
                'date_fin',
                'profil_id',
                'created_at',
                'updated_at',
            ])
            ->where('nom_activite', 'like', "%$keyword%")
            ->orWhere('statut', 'like', "%$keyword%")
            ->orWhere('responsable', 'like', "%$keyword%")
            ->orderByDesc('updated_at')
            ->get();

        return response()->json($activites, 200);
    }

    private function normalizeDate(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        $formats = ['d-m-Y', 'd/m/Y', 'Y-m-d'];

        foreach ($formats as $format) {
            try {
                return Carbon::createFromFormat($format, trim($value))->format('Y-m-d');
            } catch (\Throwable $exception) {
            }
        }

        return $value;
    }
}
