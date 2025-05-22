<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRoleIs
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $requiredRole): Response
    {
        $token = $request->user()?->currentAccessToken();

        if (!$token) {
            return response()->json(['message' => 'Нет токена'], 401);
        }

        // Сравнение по роли
        $roleMap = [
            'admin' => 1,
            'moderator' => 2,
        ];

        $tokenRoleId = $token->abilities['role_id'] ?? null;

        if (!isset($roleMap[$requiredRole]) || $tokenRoleId !== $roleMap[$requiredRole]) {
            return response()->json([
                'message' => "Доступ запрещён. Нужна роль: $requiredRole"
            ], 403);
        }

        return $next($request);
    }
}
