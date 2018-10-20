<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'content', 'task_id', 'order'
    ];

    /**
     * Массив полей, которые отображаются только при наличии доступа к задаче.
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

    /**
     * @var array
     */
    protected static $branchOrder = [];

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

    public function scopeOrder($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function getStatus() {
        if ($status = $this->statuses()->owner()->first()) {
            return $status->getLabel();
        }
        return null;
    }

    // public function getStatusCode() {
    //     $status = $this->statuses()->owner()->first();

    //     return $status ? $status->status : 0;
    // }

    public function getPrevious() {
        return $this->task->lessons->reverse()->firstWhere('order', '<', $this->order);
    }

    public function getNext() {
        return $this->task->lessons->firstWhere('order', '>', $this->order);
    }

    public function read() {
        $user_id = auth()->user()->id;

        $this->statuses()->firstOrCreate([
            'user_id' => $user_id
        ])->setSuccess();
    }

    /**
     * Наличие доступа определеяется наличию доступа к программам,
     * которым принадлежит модуль, которому принадлежит задание,
     * а также открытости самого модуля.
     *
     * @return boolean
     */
    public function isHasAccess() {
        $module = $this->task->module;
        $programs = $module->programs;
        $moduleAccess = false;
        foreach ($programs as $program) {
            if ($program->isHasAccess() && $module->isOpenedByPrevious($program)) {
                $moduleAccess = true;
            }
        }
        if (!$moduleAccess) {
            return false;
        }
        return true;
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function statuses()
    {
        return $this->morphMany(Status::class, 'statusable');
    }

    // public function ownerStatus()
    // {
    //     return $this->hasOne(LessonStatus::class)
    //         ->where('user_id', request()->user()->id);
    // }
}