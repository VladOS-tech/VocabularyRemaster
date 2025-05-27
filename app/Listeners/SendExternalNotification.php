<?php

namespace App\Listeners;

use App\Events\NotificationCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ModeratorNotificationMail;

class SendExternalNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NotificationCreated $event)
    {
        $notification = $event->notification;
        $moderator = $notification->moderator;

        Log::info('Отправка email уведомления', [
            'moderator_id' => $moderator->id,
            'email' => $moderator->notification_email,
            'contact' => $moderator->contact,
            'wants_email_notifications' => $moderator->wants_email_notifications,
            'notification_content' => $notification->content
        ]);

        if ($moderator->wants_email_notifications && $moderator->email) {
            Mail::to($moderator->email)->send(
                new ModeratorNotificationMail($notification)
            );
        }
    }
}
