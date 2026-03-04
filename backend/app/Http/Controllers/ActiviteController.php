<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use Illuminate\Http\Request;

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
        $request->validate([
            'reference' => 'required|unique:activites',
            'description' => 'required|string',
            'pta' => 'required|string',
            'bailleur' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'profil_id' => 'required|exists:profils,id',
        ]);

        $activite = Activite::create($request->all());

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
        $activite->update($request->all());

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