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
                    'login_email' => $moderator->user->login->email,
                    'notification_email' => $moderator->notification_email,
                    'telegram_chat_id' => $moderator->telegram_chat_id,
                    'wants_email_notifications' => $moderator->wants_email_notifications,
                    'wants_telegram_notifications' => $moderator->wants_telegram_notifications,
                    'online_status' => $moderator->online_status,
                    'created_at' => $moderator->created_at,
                ];
            });

        return response()->json([
            'message' => 'Список модераторов загружен',
            'data' => $moderators,
        ]);
    }

    public function show($id)
    {
        $moderator = Moderator::with([
            'user.login:id,email',
            'user:id,name,login_id',
        ])->findOrFail($id);

        return response()->json([
            'id' => $moderator->id,
            'name' => $moderator->user->name ?? null,
            'login_email' => $moderator->user->login->email ?? null,
            'notification_email' => $moderator->notification_email,
            'telegram_chat_id' => $moderator->telegram_chat_id,
            'wants_email_notifications' => $moderator->wants_email_notifications,
            'wants_telegram_notifications' => $moderator->wants_telegram_notifications,
            'online_status' => $moderator->online_status,
            'created_at' => $moderator->created_at,
        ]);
    }

    

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:logins,email',
            'password' => 'required|string|min:6',
            'name' => 'required|string|max:255',
            'notification_email' => 'nullable|email',
            'telegram_chat_id' => 'nullable|string|max:255',
            'wants_email_notifications' => 'boolean',
            'wants_telegram_notifications' => 'boolean',
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
            'notification_email' => $validated['notification_email'] ?? null,
            'telegram_chat_id' => $validated['telegram_chat_id'] ?? null,
            'wants_email_notifications' => $validated['wants_email_notifications'] ?? false,
            'wants_telegram_notifications' => $validated['wants_telegram_notifications'] ?? false,
            'online_status' => false,
        ]);
        return response()->json([
            'message' => 'Модератор успешно создан',
            'data' => [
                'id' => $moderator->id,
                'name' => $user->name,
                'login_email' => $login->email,
                'notification_email' => $moderator->notification_email,
                'telegram_chat_id' => $moderator->telegram_chat_id,
                'wants_email_notifications' => $moderator->wants_email_notifications,
                'wants_telegram_notifications' => $moderator->wants_telegram_notifications,
                'online_status' => $moderator->online_status,
            ]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'notification_email' => 'nullable|email',
            'telegram_chat_id' => 'nullable|string|max:255',
            'wants_email_notifications' => 'boolean',
            'wants_telegram_notifications' => 'boolean',
        ]);

        $moderator = Moderator::with('user')->findOrFail($id);

        if (isset($validated['name'])) {
            $moderator->user->name = $validated['name'];
            $moderator->user->save();
        }

        $moderator->update([
            'notification_email' => $validated['notification_email'] ?? $moderator->notification_email,
            'telegram_chat_id' => $validated['telegram_chat_id'] ?? $moderator->telegram_chat_id,
            'wants_email_notifications' => $validated['wants_email_notifications'] ?? $moderator->wants_email_notifications,
            'wants_telegram_notifications' => $validated['wants_telegram_notifications'] ?? $moderator->wants_telegram_notifications,
        ]);

        return response()->json([
            'message' => 'Данные модератора обновлены',
            'data' => [
                'id' => $moderator->id,
                'name' => $moderator->user->name,
                'notification_email' => $moderator->notification_email,
                'telegram_chat_id' => $moderator->telegram_chat_id,
                'wants_email_notifications' => $moderator->wants_email_notifications,
                'wants_telegram_notifications' => $moderator->wants_telegram_notifications,
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
