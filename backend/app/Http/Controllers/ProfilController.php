<?php

namespace App\Http\Controllers;

use App\Models\Profil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfilController extends Controller
{
    // 🔹 GET ALL
    public function index()
    {
        return response()->json(Profil::all(), 200);
    }

    // 🔹 CREATE
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'numero_matricule' => 'required|unique:profils',
            'mot_de_passe' => 'required|min:6',
            'service' => 'required|string',
            'fonction' => 'required|string',
            'telephone' => 'nullable|string',
        ]);

        $profil = Profil::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'numero_matricule' => $request->numero_matricule,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'service' => $request->service,
            'fonction' => $request->fonction,
            'telephone' => $request->telephone,
        ]);

        return response()->json($profil, 201);
    }

    // 🔹 GET ONE
    public function show($id)
    {
        $profil = Profil::with('activites')->findOrFail($id);
        return response()->json($profil, 200);
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $profil = Profil::findOrFail($id);

        $profil->update($request->all());

        return response()->json($profil, 200);
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        Profil::destroy($id);
        return response()->json(['message' => 'Profil supprimé'], 200);
    }

    // 🔹 SEARCH
    public function search($keyword)
    {
        $profils = Profil::where('nom', 'like', "%$keyword%")
            ->orWhere('prenom', 'like', "%$keyword%")
            ->orWhere('numero_matricule', 'like', "%$keyword%")
            ->get();

        return response()->json($profils, 200);
    }
}