<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use App\Models\Program;
use App\Models\User;

class ProgramStudent extends Model
{
    protected $table = 'program_has_students';

    protected $dates = ['created_at', 'updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'program_id', 'student_id', 'curator_id'
    ];

    public function scopeOwner($query)
    {
        $user_id = request()->user()->id;
        return $query->where('student_id', $user_id);
    }

    public function scopeStudent($query, $student_id)
    {
        return $query->where('student_id', $student_id);
    }

    public function scopeCurator($query, $curator_id)
    {
        return $query->where('curator_id', $curator_id);
    }

    public function scopeProgram($query, $program_id)
    {
        return $query->where('program_id', $program_id);
    }

    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function curator()
    {
        return $this->belongsTo(User::class, 'curator_id');
    }

    public function threads()
    {
        return $this->morphMany(Thread::class, 'threadable');
    }
}