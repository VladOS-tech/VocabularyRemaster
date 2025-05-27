<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Moderator extends Model
{
    use HasFactory;

    protected $table = 'moderators';

    protected $fillable = [
        'user_id',
        'notification_email',
        'telegram_chat_id',
        'wants_email_notifications',
        'wants_telegram_notifications',
        'online_status',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function deletionRequests()
    {
        return $this->hasMany(PhraseologyDeletionRequest::class);
    }
}

