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

    public function createNotifications() {

        switch (get_class($this->thread->threadable)) {
            case 'App\Models\TaskStatus':
                $threadable = $this->thread->threadable;
                if ($threadable->user_id != request()->user()->id) {
                    $task = $threadable->task;
                    Notification::create([
                        'title' => 'Новое сообщение к заданию "' . $task->name . '"',
                        'user_id' => $threadable->user_id,
                        'program_id' => $this->thread->program_id,
                        'type' => 'task',
                        'data' => [
                            'program_id' => $this->thread->program_id,
                            'module_id' => $task->module->id,
                            'task_id' => $task->id,
                        ]
                    ]);
                }
                break;
            case 'App\Models\ProgramStatus':
                $threadable = $this->thread->threadable;
                if ($threadable->user_id != request()->user()->id) {
                    Notification::create([
                        'title' => 'Новый ответ эксперта',
                        'user_id' => $threadable->user_id,
                        'program_id' => $this->thread->program_id,
                        'type' => 'program',
                        'data' => [
                            'program_id' => $this->thread->program_id
                        ]
                    ]);
                }
                break;
        }
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