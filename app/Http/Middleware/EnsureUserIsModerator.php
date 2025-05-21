<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsModerator
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        dd("Moderator is working");
        $user = $request->user();

        if (!$user || !$user->isModerator()) {
            return response()->json(['message' => 'Доступ разрешён только модераторам'], 403);
        }

        return $next($request);
    }
}
