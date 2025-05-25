<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Moderator;
use \App\Models\Login;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminModeratorController extends Controller
{
    public function index()
    {
        $moderators = Moderator::with(['user.login'])
            ->orderBy('id')
            ->get()
            ->map(function ($moderator) {
                return [
                    'id' => $moderator->id,
                    'name' => $moderator->user->name,
                    'email' => $moderator->user->login->email,
                    'contact' => $moderator->contact,
                    'online_status' => $moderator->online_status,
                ];
            });

        return response()->json([
            'message' => 'Список модераторов загружен',
            'data' => $moderators,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:logins,email',
            'password' => 'required|string|min:6',
            'name' => 'required|string|max:255',
            'contact' => 'required|string|unique:moderators,contact',
        ]);

        $createdLogin = false;

        $login = Login::where('email', $validated['email'])->first();

        if (!$login) {
            $login = Login::create([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            $createdLogin = true;
        }

        $alreadyModerator = $login->users()->where('role_id', 2)->exists();

        if ($alreadyModerator) {
            if ($createdLogin) {
                $login->delete();
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Этот логин уже используется как модератор',
            ], 409);
        }

        $user = User::create([
            'name' => $validated['name'],
            'login_id' => $login->id,
            'role_id' => 2,
        ]);

        $moderator = Moderator::create([
            'user_id' => $user->id,
            'contact' => $validated['contact'],
            'online_status' => false,
        ]);

        return response()->json([
            'message' => 'Модератор успешно создан',
            'data' => [
                'id' => $moderator->id,
                'name' => $user->name,
                'email' => $login->email,
                'contact' => $moderator->contact,
            ]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'contact' => 'nullable|string|unique:moderators,contact,' . $id,
        ]);

        $moderator = Moderator::with('user')->findOrFail($id);

        if (isset($validated['name'])) {
            $moderator->user->name = $validated['name'];
            $moderator->user->save();
        }

        $moderator->update([
            'contact' => $validated['contact'] ?? $moderator->contact,
        ]);

        return response()->json([
            'message' => 'Данные модератора обновлены',
            'data' => [
                'id' => $moderator->id,
                'name' => $moderator->user->name,
                'contact' => $moderator->contact,
                'online_status' => $moderator->online_status,
            ]
        ]);
    }


    public function destroy($id)
    {
        $moderator = Moderator::with('user')->findOrFail($id);

        $user = $moderator->user;
        $login = $user->login;

        $moderator->delete();
        $user->delete();

        if ($login->users()->count() === 0) {
            $login->delete();
        }

        return response()->json([
            'message' => 'Модератор и связанные данные удалены',
        ]);
    }

}
