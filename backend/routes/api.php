<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\ActiviteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ROUTE TEST
Route::get('/', function () {
    return response()->json([
        'message' => 'API ETN fonctionne'
    ]);
});


/*
|--------------------------------------------------------------------------
| ROUTES PUBLIQUES
|--------------------------------------------------------------------------
*/

// PROFILS
Route::get('/profils', [ProfilController::class, 'index']);
Route::get('/profils/{id}', [ProfilController::class, 'show']);
Route::get('/profils/search/{keyword}', [ProfilController::class, 'search']);

// ACTIVITES
Route::get('/activites', [ActiviteController::class, 'index']);
Route::get('/activites/{id}', [ActiviteController::class, 'show']);
Route::get('/activites/search/{keyword}', [ActiviteController::class, 'search']);


/*
|--------------------------------------------------------------------------
| ROUTES PROTEGEES (AUTHENTIFICATION)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->group(function () {

    // PROFILS
    Route::post('/profils', [ProfilController::class, 'store']);
    Route::put('/profils/{id}', [ProfilController::class, 'update']);
    Route::delete('/profils/{id}', [ProfilController::class, 'destroy']);

    // ACTIVITES
    Route::post('/activites', [ActiviteController::class, 'store']);
    Route::put('/activites/{id}', [ActiviteController::class, 'update']);
    Route::delete('/activites/{id}', [ActiviteController::class, 'destroy']);

});