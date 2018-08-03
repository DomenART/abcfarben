<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class ProgramModule extends Model
{
    protected $table = 'program_has_modules';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'program_id', 'module_id', 'order'
    ];

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

    public function program()
    {
        return $this->belongsTo('App\Models\Program', 'program_id');
    }

    public function module()
    {
        return $this->belongsTo('App\Models\Module', 'module_id');
    }
}