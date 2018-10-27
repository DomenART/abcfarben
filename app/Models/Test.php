<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class Test extends Model
{
    protected $dates = ['created_at', 'updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'time', 'auto'
    ];

    public function task()
    {
        return $this->hasOne(Task::class);
    }

    public function results()
    {
        return $this->hasMany(TestResult::class);
    }

    public function questions()
    {
        return $this->hasMany(TestQuestion::class, 'test_id');
    }

    public function answers()
    {
        return $this->hasManyThrough(TestAnswer::class, TestQuestion::class, 'test_id', 'question_id');
    }
}