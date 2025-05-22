<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicPhraseologyController;
use App\Http\Controllers\PublicTagController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ModeratorTagController;
use App\Http\Controllers\ModeratorPhraseologyController;



Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['csrf' => csrf_token()]);
});

Route::get('/phraseologies', [PublicPhraseologyController::class, 'index']);
//Route::get('/phraseologies/{id}', [PublicPhraseologyController::class, 'show']);
Route::post('/phraseologies', [PublicPhraseologyController::class, 'store']);
Route::get('/tags', [PublicTagController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);
Route::middleware(['auth:login', 'role:moderator'])->group(function () {
    Route::get('/moderator/phraseologies', [ModeratorPhraseologyController::class, 'index']);
    Route::get('/moderator/phraseologies/{id}', [ModeratorPhraseologyController::class, 'show']);
    Route::get('/moderator/tags', [ModeratorTagController::class, 'index']);
    Route::post('/moderator/tags', [ModeratorTagController::class, 'store']);
    Route::put('/moderator/tags/{id}', [ModeratorTagController::class, 'update']);
    Route::delete('/moderator/tags/{id}', [ModeratorTagController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);
});