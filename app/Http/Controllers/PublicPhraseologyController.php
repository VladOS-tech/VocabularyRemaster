<?php

namespace App\Http\Controllers;

use App\Models\Phraseology;
use App\Models\Context;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Moderator;
use App\Models\Notification;
use App\Events\NotificationCreated;
use Illuminate\Support\Facades\DB;


class PublicPhraseologyController extends Controller
{

    public function index(Request $request)
    {
        $sort = $request->query('sort', 'newest'); 
        $searchQuery = $request->query('search');
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
                    'content' => $phraseology->content,
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
            'contexts' => 'required|array|min:1',
            'contexts.*' => 'required|string',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ]);
        $existing = Phraseology::whereRaw('LOWER(TRIM(content)) = ?', [mb_strtolower(trim($validated['content']))])->first();
        if ($existing) {
            return response()->json([
                'message' => 'Фразеологизм с таким содержанием уже существует.',
                'existing_id' => $existing->id,
            ], 409); 
        }

        try {
            $result = DB::transaction(function () use ($validated) {
                $phraseology = Phraseology::create([
                    'content' => $validated['content'],
                    'meaning' => $validated['meaning'],
                    'status' => 'pending',
                    'created_at' => now(),
                ]);
    
                foreach ($validated['contexts'] as $contextContent) {
                    Context::create([
                        'phraseology_id' => $phraseology->id,
                        'content' => $contextContent,
                    ]);
                }
    
                if (!empty($validated['tags'])) {
                    $phraseology->tags()->attach($validated['tags']);
                }
    
                $onlineModerators = Moderator::where('online_status', true)->get();
                $targetModerators = $onlineModerators->isNotEmpty()
                    ? $onlineModerators
                    : Moderator::all();
    
                foreach ($targetModerators as $moderator) {
                    $notification = Notification::create([
                        'moderator_id' => $moderator->id,
                        'type' => 'new_phraseology',
                        'content' => 'Добавлен новый фразеологизм: «' . $phraseology->content . '». Требуется модерация.',
                        'related_id' => $phraseology->id,
                        'related_model' => 'phraseologies',
                    ]);
    
                    // событие можно вызывать после транзакции, но можно и внутри
                    event(new NotificationCreated($notification));
                }
    
                return $phraseology;
            });
    
            return response()->json([
                'message' => 'Фразеологизм отправлен на проверку!',
                'phraseology' => $result->load('tags', 'contexts'),
            ], 201);
    
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Ошибка при добавлении фразеологизма: ' . $e->getMessage()
            ], 500);
        }
    }
}

