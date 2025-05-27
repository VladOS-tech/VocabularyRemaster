<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicPhraseologyController;
use App\Http\Controllers\PublicTagController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ModeratorTagController;
use App\Http\Controllers\ModeratorPhraseologyController;
use App\Http\Controllers\AdminModeratorController;
use App\Http\Controllers\AdminDeletionRequestController;
use App\Http\Controllers\ModeratorNotificationController;

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
    Route::put('/moderator/phraseologies/{id}', [ModeratorPhraseologyController::class, 'update']);
    Route::patch('/moderator/phraseologies/{id}/approve', [ModeratorPhraseologyController::class, 'approve']);
    Route::delete('/moderator/phraseologies/{id}/reject', [ModeratorPhraseologyController::class, 'reject']);
    Route::patch('/moderator/phraseologies/{id}/delete-request', [ModeratorPhraseologyController::class, 'markForDeletion']);

    Route::get('/moderator/tags', [ModeratorTagController::class, 'index']);
    Route::post('/moderator/tags', [ModeratorTagController::class, 'store']);
    Route::put('/moderator/tags/{id}', [ModeratorTagController::class, 'update']);
    Route::delete('/moderator/tags/{id}', [ModeratorTagController::class, 'destroy']);

    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:login', 'role:admin'])->group(function(){
    Route::get('/admin/moderators', [AdminModeratorController::class, 'index']);
    Route::get('/admin/moderators/{id}', [AdminModeratorController::class, 'show']);
    Route::post('/admin/moderators', [AdminModeratorController::class, 'store']);
    Route::delete('/admin/moderators/{id}', [AdminModeratorController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin/deletion-requests')->group(function () {
    Route::get('/', [AdminDeletionRequestController::class, 'index']);
    Route::get('/{id}', [AdminDeletionRequestController::class, 'show']);
    Route::post('/{id}/approve', [AdminDeletionRequestController::class, 'approve']);
    Route::post('/{id}/reject', [AdminDeletionRequestController::class, 'reject']);
});

Route::prefix('moderator/notifications')->middleware(['auth:sanctum', 'role:moderator'])->group(function () {
    Route::get('/', [ModeratorNotificationController::class, 'index']);
    Route::get('/unread-count', [ModeratorNotificationController::class, 'unreadCount']);
    Route::patch('/{id}/read', [ModeratorNotificationController::class, 'markAsRead']);
    Route::patch('/mark-all-read', [ModeratorNotificationController::class, 'markAllAsRead']);
});

