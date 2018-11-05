<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Storage;

use App\Notifications\ExpertNewMessage;

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

    public function createNotification() {
        $thread = $this->thread;
        $program = $thread->program;
        $task = $thread->task;

        // сообщение в задаче
        if (!empty($thread->task_id)) {
            // сообщение от куратора пользователю
            if ($program->members()->where([
                ['curator_id', $this->user_id],
                ['student_id', $thread->student_id]
            ])->count()) {
                Notification::create([
                    'user_id' => $thread->student_id,
                    'title' => "Новое сообщение в задаче {$task->name}",
                    'group' => $program->name,
                    'icon' => 'doc',
                    'uri' => $task->getUri($program->id)
                ]);
            }
            // сообщение от пользователя куратору
            else {
                $member = $program->members()->where('student_id', $this->user_id)->first();
                Notification::create([
                    'user_id' => $member->curator_id,
                    'title' => "Новое сообщение в задаче {$task->name}",
                    'group' => $program->name,
                    'icon' => 'doc',
                    'uri' => "/curator/{$member->id}/tasks/{$task->id}"
                ]);
            }
        }

        // сообщение в вопросах куратору
        else if (!empty($thread->curator_id)) {
            // сообщение от куратора пользователю
            if ($this->user_id === $thread->curator_id) {
                Notification::create([
                    'user_id' => $thread->student_id,
                    'title' => "Новый ответ куратора",
                    'group' => $program->name,
                    'icon' => 'bubbles',
                    'uri' => $program->getCuratorUri()
                ]);
            }
            // сообщение от пользователя куратору
            else {
                $member = $program->members()->where('student_id', $this->user_id)->first();
                Notification::create([
                    'user_id' => $member->curator_id,
                    'title' => "Новый вопрос пользователя",
                    'group' => $program->name,
                    'icon' => 'bubbles',
                    'uri' => "/curator/{$member->id}/dialog"
                ]);
            }
        }

        // сообщение в вопросах эксперту
        else if (!empty($thread->expert_id)) {
            // сообщение от эксперта пользователю
            if ($this->user_id === $thread->expert_id) {
                Notification::create([
                    'user_id' => $thread->student_id,
                    'title' => "Новый ответ эксперта",
                    'group' => $program->name,
                    'icon' => 'bubbles',
                    'uri' => $program->getExpertUri()
                ]);
            }
            // сообщение от пользователя эксперту
            else {
                $member = $program->members()->where('student_id', $this->user_id)->first();
                Notification::create([
                    'user_id' => $thread->expert_id,
                    'title' => "Новый вопрос пользователя",
                    'group' => $program->name,
                    'icon' => 'bubbles',
                    'uri' => "/expert/{$member->id}"
                ]);

                // Уведомление на почту
                $user = User::find($thread->expert_id);
                $user->notify(new ExpertNewMessage([
                    'uri' => "/expert/{$member->id}"
                ]));
            }
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