<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tag;

class ModeratorTagController extends Controller
{
    public function index()
    {
        return response()->json(Tag::orderBy('content')->get(['id', 'content']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:255|unique:tags,content'
        ]);

        $tag = Tag::create(['content' => $request->input('content')]);

        return response()->json(['message' => 'Тег успешно создан', 'tag' => $tag], 201);
    }

    public function update(Request $request, $id)
    {
        $tag = Tag::findOrFail($id);

        $request->validate([
            'content' => 'required|string|max:255|unique:tags,content,' . $tag->id
        ]);

        $tag->update(['content' => $request->input('content')]);

        return response()->json(['message' => 'Тег успешно обновлён', 'tag' => $tag]);
    }

    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);

        if ($tag->phraseologies()->exists()) {
            return response()->json(['error' => 'Нельзя удалить тег, так как он используется'], 400);
        }

        $tag->delete();

        return response()->json(['message' => 'Тег успешно удалён']);
    }
}
