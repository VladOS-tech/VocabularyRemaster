<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class PublicTagController extends Controller
{
    public function index(): JsonResponse
    {
        $tags = Tag::all(['id', 'content']);
        return response()->json($tags);
    }

    public function search(Request $request)
    {
        $query = $request->query('q');

        if (!$query) {
            return response()->json(['error' => 'Поисковый запрос не указан'], 400);
        }

        $tags = Tag::where('content', 'ILIKE', "%$query%")
            ->orderBy('content')
            ->get()
            ->map(fn($tag) => [
                'id' => $tag->id,
                'content' => $tag->content
            ]);

        return response()->json($tags);
    }

}
