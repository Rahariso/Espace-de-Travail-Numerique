<?php

namespace App\Http\Controllers;

use App\Models\Profil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfilController extends Controller
{
    public function index()
    {
        return response()->json(Profil::all(), 200);
    }

    public function show($id)
    {
        $profil = Profil::with('activites')->findOrFail($id);

        return response()->json($profil, 200);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'Administrateur') {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

        $request->validate([
            'matricule' => 'required|unique:profils',
            'mot_de_passe' => 'required|min:6',
            'nom' => 'required',
            'role' => 'required',
            'fonction' => 'required',
            'telephone' => 'nullable',
            'image' => 'nullable|string',
        ]);

        $profil = Profil::create([
            'matricule' => $request->matricule,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'nom' => $request->nom,
            'role' => $request->role,
            'fonction' => $request->fonction,
            'telephone' => $request->telephone,
            'image' => $request->image,
        ]);

        return response()->json($profil, 201);
    }

    public function update(Request $request, $id)
    {
        $profil = Profil::findOrFail($id);
        $user = $request->user();
        $isAdmin = $user->role === 'Administrateur';

        if (!$isAdmin && $user->id !== $profil->id) {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

        if (!$isAdmin) {
            $request->merge(['role' => $profil->role]);
        }

        $request->validate([
            'matricule' => 'required|unique:profils,matricule,' . $id,
            'nom' => 'required',
            'role' => 'required',
            'fonction' => 'required',
            'telephone' => 'nullable',
            'mot_de_passe' => 'nullable|min:6',
            'image' => 'nullable|string',
        ]);

        $data = $request->only([
            'matricule',
            'nom',
            'role',
            'fonction',
            'telephone',
            'image',
        ]);

        if (!$isAdmin) {
            $data['role'] = $profil->role;
        }

        if ($request->mot_de_passe) {
            $data['mot_de_passe'] = Hash::make($request->mot_de_passe);
        }

        $profil->update($data);

        return response()->json($profil, 200);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'Administrateur') {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

        $profil = Profil::findOrFail($id);
        $profil->delete();

        return response()->json([
            'message' => 'Profil supprimé',
        ], 200);
    }

    public function search($keyword)
    {
        $profils = Profil::where('nom', 'like', "%$keyword%")
            ->orWhere('matricule', 'like', "%$keyword%")
            ->orWhere('role', 'like', "%$keyword%")
            ->orWhere('fonction', 'like', "%$keyword%")
            ->get();

        return response()->json($profils, 200);
    }
}
