<?php

namespace App\Http\Controllers;

use App\Models\Profil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $profil = Profil::where('matricule', $request->matricule)->first();

        if (!$profil || !Hash::check($request->mot_de_passe, $profil->mot_de_passe)) {
            return response()->json(['message' => 'Erreur login'], 401);
        }

        $profil->tokens()->delete();

        $token = $profil->createToken('token')->plainTextToken;

        return response()->json([
            'profil' => $profil,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logout OK']);
    }

    public function me(Request $request)
    {
        return response()->json(
            $request->user()->load('activites')
        );
    }
}
