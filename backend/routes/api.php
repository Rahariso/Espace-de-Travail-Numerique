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
