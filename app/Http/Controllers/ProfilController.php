<?php

namespace App\Http\Controllers;

use App\Models\Profil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ProfilController extends Controller
{
    public function index()
    {
        return response()->json(
            Profil::query()
                ->select(['id', 'matricule', 'nom', 'role', 'fonction', 'telephone', 'image'])
                ->orderBy('nom')
                ->get(),
            200
        );
    }

    public function show($id)
    {
        $profil = Profil::query()
            ->select(['id', 'matricule', 'nom', 'role', 'fonction', 'telephone', 'image'])
            ->findOrFail($id);

        return response()->json($profil, 200);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'Administrateur') {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

        $isPersonnel = $request->role === 'Personnel';

        $rules = [
            'matricule' => 'required|unique:profils',
            'nom' => 'required',
            'role' => 'required',
            'fonction' => 'required',
            'telephone' => 'nullable',
            'image' => 'nullable|string',
        ];

        // Le mot de passe n'est pas requis pour le rôle Personnel
        if (!$isPersonnel) {
            $rules['mot_de_passe'] = 'required|min:6';
        } else {
            $rules['mot_de_passe'] = 'nullable|min:6';
        }

        $request->validate($rules);

        $password = $request->mot_de_passe;
        if ($isPersonnel && !$password) {
            // Générer un mot de passe aléatoire pour le personnel (ils ne se connectent pas)
            $password = bin2hex(random_bytes(16));
        }

        $profil = Profil::create([
            'matricule' => $request->matricule,
            'mot_de_passe' => Hash::make($password),
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

        $isPersonnel = ($request->role ?? $profil->role) === 'Personnel';

        $request->validate([
            'matricule' => 'required|unique:profils,matricule,' . $id,
            'nom' => 'required',
            'role' => 'required',
            'fonction' => 'required',
            'telephone' => 'nullable',
            'mot_de_passe' => $isPersonnel ? 'nullable' : 'nullable|min:6',
            'image' => 'nullable|string',
        ]);

        try {
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
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise a jour du profil ID ' . $id . ' : ' . $e->getMessage());

            return response()->json([
                'message' => 'Une erreur est survenue lors de la mise a jour.',
                'error' => config('app.debug') ? $e->getMessage() : 'Erreur interne'
            ], 500);
        }
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
        $profils = Profil::query()
            ->select(['id', 'matricule', 'nom', 'role', 'fonction', 'telephone', 'image'])
            ->where('nom', 'like', "%$keyword%")
            ->orWhere('matricule', 'like', "%$keyword%")
            ->orWhere('role', 'like', "%$keyword%")
            ->orWhere('fonction', 'like', "%$keyword%")
            ->orderBy('nom')
            ->get();

        return response()->json($profils, 200);
    }
}
