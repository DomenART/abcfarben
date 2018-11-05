<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Encore\Admin\Facades\Admin;

class Task extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'type', 'content', 'order', 'module_id', 'test_id'
    ];

    /**
     * @var array
     */
    protected static $branchOrder = [];

    /**
     * @param array $files
     */
    public function setFilesAttribute($files)
    {
        if (is_array($files)) {
            $this->attributes['files'] = json_encode($files);
        }
    }

    /**
     * @param string $files
     *
     * @return array
     */
    public function getFilesAttribute($files)
    {
        return json_decode($files, true);
    }

    /**
     * Set the order of branches in the tree.
     *
     * @param array $order
     *
     * @return void
     */
    protected static function setBranchOrder(array $order)
    {
        static::$branchOrder = array_flip($order);

        static::$branchOrder = array_map(function ($item) {
            return ++$item;
        }, static::$branchOrder);
    }

    /**
     * Save tree order from a tree like array.
     *
     * @param array $tree
     */
    public static function saveOrder($tree = [])
    {
        $tree = array_pluck($tree, 'id');

        if (empty(static::$branchOrder)) {
            static::setBranchOrder($tree);
        }

        foreach ($tree as $id) {
            $node = static::findOrFail($id);

            $node->order = static::$branchOrder[$id];
            $node->save();
        }
    }

    public function getStatus() {
        if ($status = $this->statuses()->owner()->latest()) {
            return $status->getLabel();
        }
        return null;
    }

    /**
     * @return bool|integer
     */
    public function getNextLessonId() {
        $find = $this->lessons->first(function ($lesson) {
            if ($status = $lesson->statuses()->owner()->first()) {
                return $status->getLabel() !== 'success';
            }

            return true;
        });

        return $find ? $find->id : null;
    }

    /**
     * @return null|integer
     */
    public function getFirstLessonId() {
        if ($lesson = $this->lessons()->first()) {
            return $lesson->id;
        }

        return null;
    }

    /**
     * @param integer $program_id
     *
     * @return string
     */
    public function getUri($program_id) {
        return "/programs/{$program_id}/{$this->module->id}/{$this->id}";
    }

    public function start() {
        $user_id = auth()->user()->id;

        if (!$this->statuses()->user($user_id)->count()) {
            $this->statuses()->create([
                'user_id' => $user_id
            ])->setWarning();
        }
    }

    public function setSuccess() {
        $user_id = auth()->user()->id;

        $this->statuses()->firstOrCreate([
            'user_id' => $user_id
        ])->setSuccess();
    }

    /**
     * Наличие доступа определеяется наличию доступа к программам,
     * которым принадлежит модуль, а также открытости самого модуля.
     *
     * @return boolean
     */
    public function isHasAccess() {
        $programs = $this->module->programs;
        $moduleAccess = false;
        foreach ($programs as $program) {
            if ($program->isHasAccess() && $this->module->isOpenedByPrevious($program)) {
                $moduleAccess = true;
            }
        }
        if (!$moduleAccess) {
            return false;
        }
        return true;
    }

    public function scopeOrder($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'task_id')
            ->orderBy('lessons.order', 'asc');
    }

    public function statuses()
    {
        return $this->morphMany(Status::class, 'statusable');
    }

    public function threads()
    {
        return $this->hasMany(Thread::class);
    }

    // public function tests()
    // {
    //     return $this->hasMany(Test::class);
    // }

    public function test()
    {
        return $this->hasOne(Test::class);
    }
}