<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'moderator_id', 
        'content',      
        'is_read',      
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function moderator()
    {
        return $this->belongsTo(Moderator::class, 'moderator_id');
    }
}

