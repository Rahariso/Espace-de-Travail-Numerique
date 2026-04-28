<?php

namespace App\Http\Controllers;

use App\Models\Profil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'matricule' => 'required',
            'mot_de_passe' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Veuillez remplir tous les champs'], 422);
        }

        try {
            $profil = Profil::where('matricule', $request->matricule)->first();

            if (!$profil || !Hash::check($request->mot_de_passe, $profil->mot_de_passe)) {
                return response()->json(['message' => 'Erreur login'], 401);
            }

            // Supprimer les anciens tokens avant d'en créer un nouveau
            $token = $profil->createToken('token')->plainTextToken;

            return response()->json([
                'profil' => $profil,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la connexion : ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Une erreur est survenue lors de la connexion.',
                'error' => config('app.debug') ? $e->getMessage() : 'Erreur interne du serveur'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logout OK']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
