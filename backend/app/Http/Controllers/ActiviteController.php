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
            Activite::with('profil')->get(),
            200
        );
    }

    public function show($id)
    {
        $activite = Activite::with('profil')->findOrFail($id);

        return response()->json($activite, 200);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'Administrateur') {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

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
        if ($request->user()->role !== 'Administrateur') {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

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
        if ($request->user()->role !== 'Administrateur') {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

        $activite = Activite::findOrFail($id);
        $activite->delete();

        return response()->json([
            'message' => 'Activité supprimée',
        ], 200);
    }

    public function search($keyword)
    {
        $activites = Activite::where('nom_activite', 'like', "%$keyword%")
            ->orWhere('statut', 'like', "%$keyword%")
            ->orWhere('responsable', 'like', "%$keyword%")
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
