<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tag;

class ModeratorTagController extends Controller
{
    public function index()
    {
        $tags = Tag::orderBy('content')->get(['id', 'content']);

        return response()->json([
            'message' => 'Список тегов загружен',
            'data' => $tags,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:255|unique:tags,content'
        ]);

        $tag = Tag::create($validated);

        return response()->json([
            'message' => 'Тег успешно создан',
            'data' => $tag,
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $tag = Tag::findOrFail($id);

        $validated = $request->validate([
            'content' => 'required|string|max:255|unique:tags,content,' . $tag->id,
        ]);

        $tag->update($validated);

        return response()->json([
            'message' => 'Тег успешно обновлён',
            'data' => $tag,
        ]);
    }


    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();

        return response()->json([
            'message' => 'Тег успешно удалён',
            'data' => null,
        ]);
    }

}
