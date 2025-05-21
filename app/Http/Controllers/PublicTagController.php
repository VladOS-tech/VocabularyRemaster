<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class PublicTagController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');

    $tagsQuery = Tag::withCount('phraseologies')->orderBy('content');

    if ($search) {
        $tagsQuery->where('content', 'ILIKE', "%{$search}%");
    }

    $tags = $tagsQuery->get()
        ->map(fn($tag) => [
            'id' => $tag->id,
            'content' => $tag->content,
            'timesUsed' => $tag->phraseologies_count
        ]);

        return response()->json($tags);
    }
}
