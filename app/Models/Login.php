<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Login extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $table = 'logins';

    protected $fillable = ['email', 'password'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
