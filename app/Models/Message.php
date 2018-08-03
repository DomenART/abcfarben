<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Storage;

class Message extends Model
{
    protected $dates = ['created_at', 'updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'thread_id', 'user_id', 'body', 'files', 'read', 'created_at', 'updated_at'
    ];

    /**
     * @param string $files
     *
     * @return array
     */
    public function getFilesAttribute($files)
    {
        return collect(json_decode($files, true))->map(function($file) {
            return Storage::url($file);
        });
    }

    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }

    public function scopeOwner($query)
    {
        return $query->where('user_id', request()->user()->id);
    }

    public function scopeNotOwner($query)
    {
        return $query->where('user_id', '!=', request()->user()->id);
    }

    public function scopeByThread($query, $thread)
    {
        return $query->where('thread_id', $thread);
    }

    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}