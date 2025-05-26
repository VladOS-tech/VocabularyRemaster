<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'admins';

    protected $fillable = [
        'user_id', 
        'email',    
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function handledDeletionRequests()
    {
        return $this->hasMany(PhraseologyDeletionRequest::class, 'admin_id');
    }
}

