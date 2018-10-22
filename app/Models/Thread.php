<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class Thread extends Model
{
    protected $dates = ['created_at', 'updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'task_id', 'curator_id', 'expert_id', 'program_id', 'student_id', 'created_at', 'updated_at', 'program_id'
    ];

    public function scopeCurrentSrudent($query)
    {
        $user_id = auth()->user()->id;
        return $query->where('student_id', $user_id);
    }

    public function scopeBySrudent($query, $user_id)
    {
        return $query->where('student_id', $user_id);
    }

    public function curator()
    {
        return $this->belongsTo(User::class, 'curator_id');
    }

    public function expert()
    {
        return $this->belongsTo(User::class, 'expert_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}