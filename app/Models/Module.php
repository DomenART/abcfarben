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

    /**
     * Массив полей, которые отображаются только при наличии доступа к модулю.
     *
     * @var array
     */
    protected $private = [
        'content'
    ];

    public function getAttribute($key)
    {
        if (in_array($key, $this->private) && !$this->isHasAccess()) {
            return null;
        }
        return parent::getAttribute($key);
    }

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

    /**
     * @param \App\Models\Program|integer $program
     *
     * @return bool
     */
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
            if (!$row->statuses()->owner()->success()->count()) {
                $opened = false;
            }
            /*foreach ($row->tasks as $task) {
                $status = $task->statuses()->owner()->first();

                if (!$status || $status->status != 1) {
                    $opened = false;
                }
            }*/
        }

        return $opened;
    }

    /**
     * @return integer|null
     */
    public function getNextTaskId() {
        $find = $this->tasks->first(function ($task) {
            $status = $task->statuses()->owner()->first();

            return !$status || $status->status != 1;
        });

        return $find ? $find->id : null;
    }

    /**
     * @param \App\Models\Program|integer $program
     *
     * @return bool|integer
     */
    public function getNextModuleId($program) {
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

    public function getStatus() {
        if ($status = $this->statuses()->owner()->first()) {
            return $status->getLabel();
        }
        return null;
    }

    /**
     * Наличие доступа определеяется наличию доступа к программам,
     * которым принадлежит модуль, а также открытости самого модуля.
     *
     * @return boolean
     */
    public function isHasAccess() {
        $programs = $this->programs;
        $moduleAccess = false;
        foreach ($programs as $program) {
            if ($program->isHasAccess() && $this->isOpenedByPrevious($program)) {
                $moduleAccess = true;
            }
        }
        if (!$moduleAccess) {
            return false;
        }
        return true;
    }

    public function read() {
        $user_id = auth()->user()->id;

        $this->statuses()->firstOrCreate([
            'user_id' => $user_id
        ])->setSuccess();
    }

    public function programs()
    {
        return $this->belongsToMany(Program::class, 'program_has_modules');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'module_id');
    }

    public function statuses()
    {
        return $this->morphMany(Status::class, 'statusable');
    }

}