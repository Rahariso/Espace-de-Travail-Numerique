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
            'matricule' => 'required|string|unique:profils',
            'role' => 'required|string',
            'fonction' => 'required|string',
            'telephone' => 'nullable|string',
            'mot_de_passe' => 'required|min:6'
        ]);

        $profil = Profil::create([
            'nom' => $request->nom,
            'matricule' => $request->matricule,
            'role' => $request->role,
            'fonction' => $request->fonction,
            'telephone' => $request->telephone,
            'mot_de_passe' => Hash::make($request->mot_de_passe)
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

        $data = $request->all();

        if(isset($data['mot_de_passe'])){
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
            ->orWhere('matricule', 'like', "%$keyword%")
            ->orWhere('role', 'like', "%$keyword%")
            ->get();

        return response()->json($profils, 200);
    }
}