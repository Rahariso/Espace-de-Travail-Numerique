<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\ActiviteController;

// PROFILS
Route::get('/profils', [ProfilController::class, 'index']);
Route::post('/profils', [ProfilController::class, 'store']);
Route::get('/profils/{id}', [ProfilController::class, 'show']);
Route::put('/profils/{id}', [ProfilController::class, 'update']);
Route::delete('/profils/{id}', [ProfilController::class, 'destroy']);
Route::get('/profils/search/{keyword}', [ProfilController::class, 'search']);

// ACTIVITES
Route::get('/activites', [ActiviteController::class, 'index']);
Route::post('/activites', [ActiviteController::class, 'store']);
Route::get('/activites/{id}', [ActiviteController::class, 'show']);
Route::put('/activites/{id}', [ActiviteController::class, 'update']);
Route::delete('/activites/{id}', [ActiviteController::class, 'destroy']);
Route::get('/activites/search/{keyword}', [ActiviteController::class, 'search']);