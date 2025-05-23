<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class User extends Model
{
    use HasFactory;
    protected $table = 'users';

    protected $fillable = [
        'name',
        'login_id',
        'role_id',
    ];

    public function login()
    {
        return $this->belongsTo(Login::class);  
    }

     public function role()
     {
         return $this->belongsTo(Role::class);  
     }

     public function moderator()
     {
         return $this->hasOne(\App\Models\Moderator::class);
     }
     
}
