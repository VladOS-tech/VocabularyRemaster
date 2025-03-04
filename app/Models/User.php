<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasFactory,HasApiTokens;
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

    public function isAdmin()
    {
        return $this->role_id === 1;  
    }

    public function isModerator()
    {
        return $this->role_id === 2;  
    }
}
