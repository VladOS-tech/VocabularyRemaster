<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'moderator_id',
        'type',
        'content',
        'related_id',
        'related_model',
        'is_read',
    ];

    public function moderator()
    {
        return $this->belongsTo(Moderator::class);
    }

    public function related()
    {
        return $this->morphTo(null, 'related_model', 'related_id');
    }
}

