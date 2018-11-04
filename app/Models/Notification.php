<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $casts = [
        'data' => 'array',
    ];

    protected $fillable = [
        'title', 'user_id', 'program_id', 'data'
    ];

    public function scopeOwner($query)
    {
        return $query->where('user_id', request()->user()->id);
    }

    public function scopeOrder($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}