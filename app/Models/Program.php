<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;
use Jenssegers\Date\Date;
use Illuminate\Support\Facades\Log;

class Program extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'content', 'annotation', 'image', 'passing_time', 'users', 'positions'
    ];


    protected $casts = [
        'extra' => 'json',
    ];

    public function setUsersAttribute($users)
    {
        $this->users()->detach();
        if ( ! $users) return;
        if ( ! $this->exists) $this->save();
        $this->users()->attach($users);
    }

    public function setPositionsAttribute($positions)
    {
        $this->positions()->detach();
        if ( ! $positions) return;
        if ( ! $this->exists) $this->save();
        $this->positions()->attach($positions);
    }

    /**
     * @param integer $user_id
     * @return boolean
     */
    public function userHasAccess($user_id)
    {
        if ($this->public) return true;

        if (!$user = User::find($user_id)) return false;

        if ($this->users()->where('user_id', $user_id)->count()) {
            return true;
        }

        $positions = $user->positions->pluck('id')->all();
        if ($this->positions()->whereIn('positions.id', $positions)->count()) {
            return true;
        }

        return false;
    }

    /**
     * @return boolean
     */
    public function isHasAccess()
    {
        if ($user = auth()->user()) {
            return $this->userHasAccess($user->id);
        }

        return  false;
    }

    /**
     * @return string during||completed||available||unavailable
     */
    public function getStatus()
    {
        /**
         * @var User $user
         */
        if ($user = Auth::user()) {
            if ($this->statuses()->user($user->id)->success()->count()) {
                return 'completed';
                // switch ($status->status) {
                //     case 1: return 'during'; break;
                //     case 2: return 'completed'; break;
                // }
            }

            if ($this->members()->student($user->id)->count()) {
                return 'during';
            }

            if ($this->userHasAccess($user->id)) {
                return 'available';
            }
        }

        return 'unavailable';
    }

    /**
     * @return string
     */
    public function getPassingTime()
    {
        $text = [];
        if ($this->passing_time === 0) {
            $text = ['бессрочно'];
        } else if ($this->passing_time < 30) {
            $text = [
                $this->passing_time,
                Lang::choice('день|дня|дней', $this->passing_time, [], 'ru')
            ];
        } else {
            $months = floor($this->passing_time / 30);
            $days = $this->passing_time % 30;
            $text = [
                $months,
                Lang::choice('месяц|месяца|месяцев', $months, [], 'ru'),
                'и',
                $days,
                Lang::choice('день|дня|дней', $days, [], 'ru')
            ];

        }

        return implode(' ', $text);
    }

    /**
     * @return string
     */
    public function getCompletedTime()
    {
        if ($user = Auth::user()) {
            if ($status = $this->statuses()->user($user->id)->success()->first()) {
                return Date::parse($status->updated_at)->format('j F');
            }
        }
        // if ($user = Auth::user()) {
        //     if ($status = $this->statuses()->user($user->id)->first()) {
        //         if ($status->status === 2) {
        //             return Date::parse($status->updated_at)->format('j F');
        //         }
        //     }
        // }

        return null;
    }

    /**
     * @return string
     */
    public function getBeCompletedTime()
    {
        // if ($user = Auth::user()) {
        //     if ($status = $this->statuses()->user($user->id)->first()) {
        //         if ($status->status === 1) {
        //             return Date::parse($status->created_at)
        //                 ->add($this->passing_time . ' day')
        //                 ->format('j F');
        //         }
        //     }
        // }
        if ($user = Auth::user()) {
            if ($status = $this->statuses()->user($user->id)->primary()->first()) {
                return Date::parse($status->created_at)
                    ->add($this->passing_time . ' day')
                    ->format('j F');
            }
        }

        return null;
    }

    public function starting() {
        $user_id = request()->user()->id;

        if (!$this->members()->student($user_id)->count()) {
            $this->members()->create([
                'student_id' => $user_id,
                'curator_id' => $this->curator_id
            ]);
        }

        if (!$this->statuses()->user($user_id)->count()) {
            $this->statuses()->create([
                'user_id' => $user_id
            ])->setPrimary();
        }
    }

    /**
     * @return array
     */
    public function getModules()
    {
        $modules = $this->modules()->with('tasks', 'tasks.statuses')->get();
        $modules = $modules->map(function ($module, $key) use ($modules) {
            $tasks = $module->tasks->map(function($task) {
                $output = [
                    'id' => $task->id,
                    'name' => $task->name
                ];

                if ($status = $task->statuses()->owner()->first()) {
                    $output['status'] = $status->getLabel();
                }

                return $output;
            });

            return [
                'id' => $module->id,
                'name' => $module->name,
                'tasks' => $tasks,
                'opened' => $module->isOpenedByPrevious($this)
            ];
        });
        return $modules;
    }

    /**
     * @param Task|integer $task
     *
     * @return bool
     */
    public function isContainsTask($task) {
        if (gettype($task) == 'integer') {
            $task = Task::find($task);
        }

        return (bool) $this->modules->first(function ($module) use ($task) {
            return $module->id === $task->module_id;
        });
    }

    /**
     * @param Lesson|integer $lesson
     *
     * @return bool
     */
    public function isContainsLesson($lesson) {
        if (gettype($lesson) == 'integer') {
            $lesson = Lesson::find($lesson);
        }

        return (bool) $this->isContainsTask($lesson->task);
    }

    /**
     * @param integer|null $user_id
     *
     * @return array
     */
    public function getProgress($user_id = null) {
        $user_id = !empty($user_id) ? $user_id : request()->user()->id;

        $response = [
            'done' => 0,
            'available' => 0,
            'total' => 0,
        ];

        foreach ($this->modules as $module) {
            foreach ($module->tasks as $task) {
                if ($module->isOpenedByPrevious($this->id)) {
                    $response['available']++;

                    if ($task->statuses()->user($user_id)->success()->count()) {
                        $response['done']++;
                    }
                }

                $response['total']++;
            }
        }

        return $response;
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'program_has_users');
    }

    public function positions()
    {
        return $this->belongsToMany(Position::class, 'program_has_positions');
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'program_has_modules')
            ->withPivot(['order', 'id'])
            ->orderBy('pivot_order', 'asc');
    }

//    public function tasks()
//    {
//        return $this->hasManyThrough(
//            Task::class,
//            Module::class
//        );
//    }

    public function members()
    {
        return $this->hasMany(ProgramMember::class);
    }

    public function statuses()
    {
        return $this->morphMany(Status::class, 'statusable');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'program_id');
    }

    public function threads()
    {
        return $this->hasMany(Thread::class);
    }
}