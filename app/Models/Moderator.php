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
        'contact',
        'online_status',
        'email',
        'wants_email_notifications',
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

