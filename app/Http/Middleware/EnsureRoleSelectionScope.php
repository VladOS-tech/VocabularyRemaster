<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRoleSelectionScope
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        $user = $request->user();

        if (! $user || ! $user->tokenCan('role-selection')) {
            return response()->json(['message' => 'Недостаточно прав для выбора роли'], 403);
        }

        return $next($request);
    }
}
