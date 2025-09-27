<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasFactory, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'image_url',
        'role'
    ];

    /**
     * A user can have multiple chat sessions.
     */
    public function chats()
    {
        return $this->hasMany(Chat::class);
    }
}