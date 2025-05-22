<?php

namespace App\Http\Controllers;

use App\Models\Phraseology;
use App\Models\Context;
use App\Models\Tag;
use Illuminate\Http\Request;

class ModeratorPhraseologyController extends Controller
{
    public function index()
    {
        $phraseologies = Phraseology::where('status', 'pending')
            ->with('tags', 'contexts')
            ->get()
            ->map(function ($phraseology) {
                return [
                    'id' => $phraseology->id,
                    'date' => $phraseology->confirmed_at ?? $phraseology->updated_at,
                    'content' => $phraseology->content,
                    'meaning' => $phraseology->meaning,
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
            'status' => 'nullable|in:pending,confirmed,rejected',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ]);

        $phraseology = Phraseology::findOrFail($id);
        
        if ($phraseology->status === 'confirmed') {
            return response()->json(['message' => 'Редактирование подтверждённых фразеологизмов запрещено'], 403);
        }

        $phraseology->update($validated);

        if ($request->has('tags')) {
            $phraseology->tags()->sync($request->tags);
        }

        return response()->json([
            'message' => 'Фразеологизм обновлён!',
            'phraseology' => $phraseology
        ]);
    }

    public function confirm($id)
    {
        $phraseology = Phraseology::findOrFail($id);

        if ($phraseology->status !== 'pending') {
            return response()->json(['message' => 'Фразеологизм уже обработан'], 400);
        }

        $phraseology->update(['status' => 'approved']);

        return response()->json([
            'message' => 'Фразеологизм подтверждён!',
            'phraseology' => $phraseology
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

