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
            return response()->json([
                'message' => 'Выберите роль',
                'roles' => $users->map(fn($user) => [
                    'user_id' => $user->id,
                    'role_id' => $user->role_id,
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
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::with('role', 'login')->find($request->user_id);

        if (!$user || !$user->login) {
            return response()->json(['message' => 'Пользователь или логин не найден'], 404);
        }

        $token = $user->login->createToken('api-token', [
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
