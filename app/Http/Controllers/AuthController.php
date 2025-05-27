<?php

namespace App\Http\Controllers;

use App\Models\Login;
use App\Models\User;
use App\Models\Moderator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $login = Login::where('email', $request->email)->first();

        if (!$login || !Hash::check($request->password, $login->password)) {
            return response()->json(['message' => 'Неверный логин или пароль'], 401);
        }

        $users = $login->users;

        if ($users->count() > 1) {
            $token = $login->createToken('role-selection', ['role-selection'])->plainTextToken;

            return response()->json([
                'message' => 'Выберите роль',
                'token' => $token,
                'roles' => $users->map(fn($user) => [
                    'role_name' => $user->role->name,
                    'name' => $user->name,
                ]),
            ]);
        }

        $user = $users->first();
        $token = $login->createToken('api-token', [
            'user_id' => $user->id,
            'role_id' => $user->role_id,
        ])->plainTextToken;

        if ($user -> role_id === 2){
             $moderator = Moderator::where('user_id', $user->id)->first();
            if ($moderator) {
                $moderator->update(['online_status' => true]);
            }
    }

        return response()->json([
            'message' => 'Авторизация успешна',
            'user_id' => $user->id,
            'role' => $user->role->name,
            'token' => $token,
            'name' => $user->name,
        ]);
    }


    public function selectRole(Request $request)
    {
        $request->validate([
            'role_index' => 'required|integer',
        ]);

        /** @var \App\Models\Login $login */
        $login = $request->user();

        if (!$login instanceof Login) {
            return response()->json(['message' => 'Недопустимый токен'], 403);
        }

        $users = $login->users;

        if ($request->role_index < 0 || $request->role_index >= $users->count()) {
            return response()->json(['message' => 'Недопустимый индекс роли'], 400);
        }

        $user = $users[$request->role_index];

        $token = $login->createToken('api-token', [
            'user_id' => $user->id,
            'role_id' => $user->role_id,
        ])->plainTextToken;

        if ($user->role_id === 2) {
            Moderator::where('user_id', $user->id)->update(['online_status' => true]);
        }

        return response()->json([
            'message' => 'Роль выбрана успешно',
            'role' => $user->role->name,
            'user_id' => $user->id,
            'token' => $token,
            'name' => $user->name,
        ]);
    }



    public function logout(Request $request)
    {
        $login = $request->user();
        $user = User::where('login_id', $login->id)
                ->where('role_id', 2)
                ->first();

        if ($user) {
            Moderator::where('user_id', $user->id)
                        ->update(['online_status' => false]);
        }

        $login->currentAccessToken()->delete();

        return response()->json(['message' => 'Вы вышли из системы']);
    }

}
