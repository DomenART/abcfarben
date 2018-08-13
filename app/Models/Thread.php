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
        'threadable_id', 'threadable_type', 'created_at', 'updated_at', 'program_id'
    ];

    public function threadable()
    {
        return $this->morphTo();
    }
}