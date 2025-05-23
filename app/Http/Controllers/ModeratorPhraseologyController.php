<?php

namespace App\Http\Controllers;

use App\Models\Phraseology;
use App\Models\Context;
use App\Models\Tag;
use Illuminate\Http\Request;

class ModeratorPhraseologyController extends Controller
{

    public function index(Request $request)
    {
        $statuses = (array) $request->input('status', 'pending');
    
        $validStatuses = ['pending', 'approved', 'rejected', 'deletion_requested'];
    
        foreach ($statuses as $status) {
            if (!in_array($status, $validStatuses)) {
                return response()->json(['message' => "Недопустимый статус: $status"], 400);
            }
        }
    
        $phraseologies = Phraseology::whereIn('status', $statuses)
            ->with(['tags', 'contexts'])
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($phraseology) {
                return [
                    'id' => $phraseology->id,
                    'date' => $phraseology->confirmed_at ?? $phraseology->updated_at,
                    'content' => $phraseology->content,
                    'meaning' => $phraseology->meaning,
                    'status' => $phraseology->status,
                    'tags' => $phraseology->tags->map(fn($tag) => [
                        'id' => $tag->id,
                        'content' => $tag->content
                    ]),
                    'contexts' => $phraseology->contexts->map(fn($context) => [
                        'id' => $context->id,
                        'content' => $context->content
                    ])
                ];
            });
    
        return response()->json($phraseologies);
    }
    
    public function show($id)
    {
        $phraseology = Phraseology::with('tags', 'contexts')->findOrFail($id);

        return response()->json([
            'id' => $phraseology->id,
            'content' => $phraseology->content,
            'meaning' => $phraseology->meaning,
            'status' => $phraseology->status,
            'created_at' => $phraseology->created_at,
            'tags' => $phraseology->tags->map(fn($tag) => [
                'id' => $tag->id,
                'content' => $tag->content,
            ]),
            'contexts' => $phraseology->contexts->map(fn($ctx) => [
                'id' => $ctx->id,
                'content' => $ctx->content,
            ])
        ]);
    }


    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'content' => 'nullable|string',
            'meaning' => 'nullable|string',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
            'contexts' => 'nullable|array',
            'contexts.*' => 'string|min:1',
        ]);

        $phraseology = Phraseology::with('tags', 'contexts')->findOrFail($id);
        
        if ($phraseology->status === 'approved') {
            return response()->json(['message' => 'Редактирование подтверждённых фразеологизмов запрещено'], 403);
        }

        $phraseology->fill([
            'content' => $validated['content'] ?? $phraseology->content,
            'meaning' => $validated['meaning'] ?? $phraseology->meaning,
        ]);

        $phraseology->updated_at = now();
        $phraseology->save();  
        
        if (isset($validated['tags'])) {
            $phraseology->tags()->sync($validated['tags']);
        }
    
        if (isset($validated['contexts'])) {
            $phraseology->contexts()->delete();
            foreach ($validated['contexts'] as $contextContent) {
                $phraseology->contexts()->create([
                    'content' => $contextContent,
                ]);
            }
        }
        $phraseology->load('tags', 'contexts');


        return response()->json([
            'message' => 'Фразеологизм обновлён!',
            'phraseology' => [
                'id' => $phraseology->id,
                'content' => $phraseology->content,
                'meaning' => $phraseology->meaning,
                'status' => $phraseology->status,
                'date' => $phraseology->confirmed_at ?? $phraseology->updated_at,
                'tags' => $phraseology->tags->map(fn($tag) => [
                    'id' => $tag->id,
                    'content' => $tag->content,
                ]),
                'contexts' => $phraseology->contexts->map(fn($ctx) => [
                    'id' => $ctx->id,
                    'content' => $ctx->content,
                ]),
            ]
        ]);
    }

    public function approve($id)
    {
        $phraseology = Phraseology::findOrFail($id);

        if ($phraseology->status !== 'pending') {
            return response()->json(['message' => 'Фразеологизм уже обработан'], 400);
        }

        /** @var \App\Models\Login $login */
        $login = auth()->guard('login')->user();

        $accessToken = $login->currentAccessToken();
        $userId = $accessToken?->abilities['user_id'] ?? null;

        if (!$userId) {
            return response()->json(['message' => 'Роль не определена'], 403);
        }

        $user = \App\Models\User::with('moderator')->find($userId);

        if (!$user || $user->role_id !== 2 || !$user->moderator) {
            return response()->json(['message' => 'Вы не модератор'], 403);
        }

        $phraseology->update([
            'status' => 'approved',
            'confirmed_at' => now(),
            'moderator_id' => $user->moderator->id,
        ]);

        return response()->json([
            'message' => 'Фразеологизм подтверждён!',
            'phraseology' => [
                'id' => $phraseology->id,
                'status' => $phraseology->status,
                'confirmed_at' => $phraseology->confirmed_at,
                'moderator_id' => $phraseology->moderator_id,
            ]
        ]);
    }



    public function reject($id)
    {
        $phraseology = Phraseology::findOrFail($id);

        if ($phraseology->status !== 'pending') {
            return response()->json(['message' => 'Фразеологизм уже обработан'], 400);
        }

        $phraseology->delete();

        return response()->json(['message' => 'Фразеологизм удалён!']);
    }

    public function requestDeletion(Request $request, $id)
    {
        $phraseology = Phraseology::findOrFail($id);

        if ($phraseology->status !== 'approved') {
            return response()->json(['message' => 'Только подтверждённые фразеологизмы могут быть отправлены на удаление'], 400);
        }

        $phraseology->update(['status' => 'deletion_requested']);

        return response()->json([
            'message' => 'Фразеологизм отправлен на удаление!',
            'phraseology' => $phraseology
        ]);
    }

    public function updateTags(Request $request, $id)
    {
        $validated = $request->validate([
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ]);

        $phraseology = Phraseology::findOrFail($id);
        $phraseology->tags()->sync($validated['tags']);

        return response()->json(['message' => 'Теги обновлены!']);
    }
}

