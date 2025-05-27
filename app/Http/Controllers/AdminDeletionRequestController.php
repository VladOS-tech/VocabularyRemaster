<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PhraseologyDeletionRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use App\Events\NotificationCreated;

class AdminDeletionRequestController extends Controller
{
    public function index()
    {
        $requests = PhraseologyDeletionRequest::where('status', 'pending')
        ->with(['phraseology:id,content',
            'moderator.user.login:id,email',
            'moderator.user:id,name,login_id',])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($request) {
            return [
                'id' => $request->id,
                'phraseology_content' => $request->phraseology->content,
                'moderator_name' => $request->moderator->user->name ?? null,
                'moderator_email' => $request->moderator->user->login->email ?? null,
                'reason' => $request->reason,
                'created_at' => $request->created_at,
            ];
        });

    return response()->json($requests);
    }

    public function show($id)
    {
        $request = PhraseologyDeletionRequest::with([
            'phraseology.tags:id,content',
            'phraseology.contexts:id,content',
            'phraseology:id,content,meaning',
            'moderator.user:id,name,email'
        ])
        ->where('status', 'pending')
        ->findOrFail($id);

        $phraseology = $request->phraseology;

        return response()->json([
            'id' => $request->id,
            'phraseology' => [
                'content' => $phraseology->content,
                'meaning' => $phraseology->meaning,
                'tags' => $phraseology->tags->map(fn($tag) => [
                    'id' => $tag->id,
                    'content' => $tag->content,
                ]),
                'contexts' => $phraseology->contexts->map(fn($context) => [
                    'id' => $context->id,
                    'content' => $context->content,
                ]),
            ],
            'moderator_name' => $request->moderator->user->name ?? null,
            'moderator_email' => $request->moderator->user->email ?? null,
            'reason' => $request->reason,
            'created_at' => $request->created_at,
        ]);
    }



    public function approve(Request $request, $id)
    {
        $deletionRequest = PhraseologyDeletionRequest::with('phraseology')->findOrFail($id);

        if ($deletionRequest->status !== 'pending') {
            return response()->json(['message' => 'Заявка уже была рассмотрена.'], 400);
        }

        $admin = Auth::user()->admin ?? null;
        if (!$admin) {
            return response()->json(['message' => 'Вы не являетесь администратором.'], 403);
        }

        $deletionRequest->update([
            'status' => 'approved',
            'comment' => $request->input('comment'),
            'admin_id' => $admin->id,
            'reviewed_at' => now(),
        ]);

        if ($deletionRequest->phraseology) {
            $deletionRequest->phraseology->delete();
        }

        $notification = Notification::create([
            'moderator_id' => $deletionRequest->moderator_id,
            'type' => 'deletion_result',
            'content' => 'Ваша заявка на удаление фразеологизма была одобрена. Фразеологизм удалён.',
            'related_id' => $deletionRequest->id,
            'related_model' => 'phraseology_deletion_requests',
        ]);
        event(new NotificationCreated($notification));


        return response()->json(['message' => 'Фразеологизм удалён.']);
    }

    public function reject(Request $request, $id)
    {
        $deletionRequest = PhraseologyDeletionRequest::findOrFail($id);

        if ($deletionRequest->status !== 'pending') {
            return response()->json(['message' => 'Заявка уже рассмотрена.'], 400);
        }

        $admin = Auth::user()->admin ?? null;
        if (!$admin) {
            return response()->json(['message' => 'Вы не являетесь администратором.'], 403);
        }

        $comment = $request->input('comment');
        if (!$comment || trim($comment) === '') {
            return response()->json(['message' => 'Комментарий обязателен при отклонении заявки.'], 422);
        }

        $deletionRequest->update([
            'status' => 'rejected',
            'comment' => $comment,
            'admin_id' => $admin->id,
            'reviewed_at' => now(),
        ]);

        $notification = Notification::create([
            'moderator_id' => $deletionRequest->moderator_id,
            'type' => 'deletion_result',
            'content' => 'Ваша заявка на удаление фразеологизма была отклонена. Комментарий администратора: ' . ($request->input('comment') ?? 'Без комментария.'),
            'related_id' => $deletionRequest->id,
            'related_model' => 'phraseology_deletion_requests',
        ]);     
        event(new NotificationCreated($notification));

        return response()->json(['message' => 'Заявка отклонена.']);
    }
}
