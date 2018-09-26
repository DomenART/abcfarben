<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'order', 'module_id', 'solo'
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

    public function getStatusCode() {
        $status = $this->statuses()->owner()->first();

        return $status ? $status->status : 0;
    }

    /**
     * @return bool|integer
     */
    public function getNextLesson() {
        $find = $this->lessons->first(function ($lesson) {
            $status = $lesson->statuses()->owner()->first();

            return !$status || $status->status != 1;
        });

        return $find ? $find->id : false;
    }

    /**
     * @return null|integer
     */
    public function getFirstLesson() {
        if ($lesson = $this->lessons()->first()) {
            return $lesson->id;
        }

        return null;
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

    // public function statuses()
    // {
    //     return $this->hasMany(TaskStatus::class);
    // }
}