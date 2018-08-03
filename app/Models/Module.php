<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class Module extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'content', 'program'
    ];

    public function setProgramAttribute($program)
    {
        // nothing
    }

    public function scopeWithoutProgram($query, $program)
    {
        return $query->whereDoesntHave('programs', function ($query) use($program) {
            $query->where('programs.id', $program);
        });
    }

    public function isOpenedByPrevious($program)
    {
        if (gettype($program) == 'integer') {
            $program = Program::find($program);
        }

        $previous = new Collection;
        $program->modules->each(function ($item) use ($previous) {
            if ($item->id == $this->id) {
                return false;
            } else {
                $previous->push($item);
            }
        });

        $opened = true;

        foreach ($previous as $row) {
            foreach ($row->tasks as $task) {
                $status = $task->statuses()->owner()->first();

                if (!$status || $status->status != 1) {
                    $opened = false;
                }
            }
        }

        return $opened;
    }

    /**
     * @return bool|integer
     */
    public function getNextTask() {
        $find = $this->tasks->first(function ($task) {
            $status = $task->statuses()->owner()->first();

            return !$status || $status->status != 1;
        });

        return $find ? $find->id : false;
    }

    /**
     * @param \App\Models\Program|integer $program
     *
     * @return bool|integer
     */
    public function getNextModule($program) {
        if (gettype($program) == 'integer') {
            $program = Program::find($program);
        }

        $output = false;
        $isNext = false;
        foreach ($program->modules as $module) {
            if ($isNext) {
                $output = $module->id;
                $isNext = false;
            }
            if ($module->id == $this->id) {
                $isNext = true;
            }
        }

        return $output;
    }

    public function programs()
    {
        return $this->belongsToMany(Program::class, 'program_has_modules');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'module_id');
    }

}