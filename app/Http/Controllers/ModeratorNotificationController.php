<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModeratorNotificationController extends Controller
{
    public function index()
    {
        $moderator = Auth::user()->moderator ?? null;
        if (!$moderator) {
            return response()->json(['message' => 'Модератор не найден.'], 403);
        }

        $notifications = Notification::where('moderator_id', $moderator->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    public function unreadCount()
    {
        $moderator = Auth::user()->moderator ?? null;
        if (!$moderator) {
            return response()->json(['count' => 0], 200);
        }

        $count = Notification::where('moderator_id', $moderator->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    public function markAsRead($id)
    {
        $moderator = Auth::user()->moderator ?? null;
        if (!$moderator) {
            return response()->json(['message' => 'Модератор не найден.'], 403);
        }

        $notification = Notification::where('moderator_id', $moderator->id)->findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Уведомление прочитано.']);
    }

    public function markAllAsRead()
    {
        $moderator = Auth::user()->moderator ?? null;
        if (!$moderator) {
            return response()->json(['message' => 'Модератор не найден.'], 403);
        }

        Notification::where('moderator_id', $moderator->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Все уведомления помечены как прочитанные.']);
    }
}
