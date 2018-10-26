<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class TestQuestion extends Model
{
    protected $table = 'test_questions';

    protected $dates = ['created_at', 'updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'test_id', 'title', 'order'
    ];

    public function scopeOrder($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    public function answers()
    {
        return $this->hasMany(TestAnswer::class, 'question_id');
    }
}