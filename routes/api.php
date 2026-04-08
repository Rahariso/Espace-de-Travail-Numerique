<?php

use App\Http\Controllers\ActiviteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfilController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'API ETN fonctionne',
    ]);
});

Route::get('/test-db', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        return response()->json([
            'status' => 'success',
            'message' => 'Connexion base de donnees OK',
            'host' => request()->getHost(),
            'server_ip' => $_SERVER['SERVER_ADDR'] ?? 'unknown'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Echec connexion base de donnees : ' . $e->getMessage(),
            'host' => request()->getHost(),
            'server_ip' => $_SERVER['SERVER_ADDR'] ?? 'unknown',
            'database_config' => [
                'host' => config('database.connections.mysql.host'),
                'database' => config('database.connections.mysql.database'),
                'username' => config('database.connections.mysql.username'),
            ]
        ], 500);
    }
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profils', [ProfilController::class, 'index']);
    Route::get('/profils/{id}', [ProfilController::class, 'show']);
    Route::get('/profils/search/{keyword}', [ProfilController::class, 'search']);
    Route::post('/profils', [ProfilController::class, 'store']);
    Route::put('/profils/{id}', [ProfilController::class, 'update']);
    Route::delete('/profils/{id}', [ProfilController::class, 'destroy']);

    Route::get('/activites', [ActiviteController::class, 'index']);
    Route::get('/activites/{id}', [ActiviteController::class, 'show']);
    Route::get('/activites/search/{keyword}', [ActiviteController::class, 'search']);
    Route::post('/activites', [ActiviteController::class, 'store']);
    Route::put('/activites/{id}', [ActiviteController::class, 'update']);
    Route::delete('/activites/{id}', [ActiviteController::class, 'destroy']);
});
