<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ActiviteController extends Controller
{
    // 🔹 GET ALL
    public function index()
    {
        return response()->json(
            Activite::with('profil')->get(),
            200
        );
    }

    // 🔹 CREATE
    public function store(Request $request)
    {
        $data = $request->all();

        // Convertir dd/mm/yyyy → Y-m-d pour MySQL
        try {
            $data['date_debut'] = Carbon::createFromFormat('d/m/Y', $data['date_debut'])->format('Y-m-d');
            $data['date_fin'] = Carbon::createFromFormat('d/m/Y', $data['date_fin'])->format('Y-m-d');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Format de date invalide, utilisez dd/mm/yyyy'], 422);
        }

        // Validation après conversion
        $request->merge($data);
        $request->validate([
            'reference' => 'required|unique:activites',
            'description' => 'required|string',
            'pta' => 'required|string',
            'bailleur' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'profil_id' => 'required|exists:profils,id',
        ]);

        $activite = Activite::create($data);

        return response()->json($activite, 201);
    }

    // 🔹 GET ONE
    public function show($id)
    {
        $activite = Activite::with('profil')->findOrFail($id);
        return response()->json($activite, 200);
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $activite = Activite::findOrFail($id);
        $data = $request->all();

        // Convertir les dates dd/mm/yyyy → Y-m-d si présentes
        try {
            if(isset($data['date_debut'])) {
                $data['date_debut'] = Carbon::createFromFormat('d/m/Y', $data['date_debut'])->format('Y-m-d');
            }
            if(isset($data['date_fin'])) {
                $data['date_fin'] = Carbon::createFromFormat('d/m/Y', $data['date_fin'])->format('Y-m-d');
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Format de date invalide, utilisez dd/mm/yyyy'], 422);
        }

        $request->merge($data);
        $request->validate([
            'reference' => 'sometimes|required|unique:activites,reference,' . $id,
            'description' => 'sometimes|required|string',
            'pta' => 'sometimes|required|string',
            'bailleur' => 'sometimes|required|string',
            'date_debut' => 'sometimes|required|date',
            'date_fin' => 'sometimes|required|date',
            'profil_id' => 'sometimes|required|exists:profils,id',
        ]);

        $activite->update($data);

        return response()->json($activite, 200);
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        Activite::destroy($id);
        return response()->json(['message' => 'Activité supprimée'], 200);
    }

    // 🔹 SEARCH
    public function search($keyword)
    {
        $activites = Activite::where('reference', 'like', "%$keyword%")
            ->orWhere('description', 'like', "%$keyword%")
            ->get();

        return response()->json($activites, 200);
    }
}