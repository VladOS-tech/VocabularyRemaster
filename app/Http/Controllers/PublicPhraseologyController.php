<?php

namespace App\Http\Controllers;

use App\Models\Phraseology;
use App\Models\Context;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class PublicPhraseologyController extends Controller
{

    public function index(Request $request)
    {
        $sort = $request->query('sort', 'newest'); 
        $searchQuery = $request->query('query');
        $tagsParam = $request->query('tags');


        $query = Phraseology::query() ->where('status', 'approved');

        if ($tagsParam) {
            $tagIds = explode(',', $tagsParam);
            $query->whereHas('tags', function ($tagQuery) use ($tagIds) {
                $tagQuery->whereIn('tags.id', $tagIds);
            }, '=', count($tagIds));
        }

        if ($searchQuery) {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('content', 'ILIKE', '%' . $searchQuery . '%')
                  ->orWhereHas('tags', function ($tagQuery) use ($searchQuery) {
                      $tagQuery->where('content', 'ILIKE', '%' . $searchQuery . '%');
                  });
            });
        }

        switch ($sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'alphabetic':
                $query->orderBy('content', 'asc'); 
                break;
            case 'alphabetic-reverse':
                $query->orderBy('content', 'desc'); 
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $phraseologies = $query->with('tags', 'contexts')
            ->get()
            ->map(function ($phraseology) {
                return [
                    'id' => $phraseology->id,
                    'date' => $phraseology->created_at,  
                    'phrase' => $phraseology->content,
                    'tags' => $phraseology->tags->map(fn($tag) => [
                        'id' => $tag->id,
                        'content' => $tag->content
                    ]),
                    'meanings' => $phraseology->meaning,
                    'contexts' => $phraseology->contexts->map(fn($context) => [
                        'id' => $context->id,
                        'content' => $context->content
                    ])
                ];
            });

        return response()->json($phraseologies);
    }


    
    /*public function show($id)
    {
        $phraseology = Phraseology::where('id', $id)->where('status', 'confirmed')->firstOrFail();
        return response()->json($phraseology);
    }*/

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:255',
            'meaning' => 'required|string',
            'context' => 'required|string',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ]);

        $phraseology = Phraseology::create([
            'content' => $validated['content'],
            'meaning' => $validated['meaning'],
            'status' => 'pending',
            'created_at' => now(), 
        ]);

        Context::create([
            'phraseology_id' => $phraseology->id,
            'content' => $validated['context'],
        ]);

        if (!empty($validated['tags'])) {
            $phraseology->tags()->attach($validated['tags']);
        }

        return response()->json([
            'message' => 'Фразеологизм отправлен на проверку!',
            'phraseology' => $phraseology->load('tags'),
        ], 201);
    }

}

