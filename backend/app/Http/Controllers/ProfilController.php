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

    // 🔹 CREATE OR UPDATE
    public function store(Request $request)
    {
        // Validation
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'numero_matricule' => 'required|string',
            'mot_de_passe' => 'required|min:6',
            'service' => 'required|string',
            'fonction' => 'required|string',
            'telephone' => 'nullable|string',
        ]);

        // Create or update based on numero_matricule
        $profil = Profil::updateOrCreate(
            ['numero_matricule' => $request->numero_matricule],
            [
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'mot_de_passe' => Hash::make($request->mot_de_passe),
                'service' => $request->service,
                'fonction' => $request->fonction,
                'telephone' => $request->telephone,
            ]
        );

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

        // On ne modifie pas le numero_matricule dans update
        $data = $request->except('numero_matricule');

        // Si le mot de passe est fourni, hash
        if (isset($data['mot_de_passe'])) {
            $data['mot_de_passe'] = Hash::make($data['mot_de_passe']);
        }

        $profil->update($data);

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