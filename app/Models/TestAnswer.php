<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class TestAnswer extends Model
{
    protected $table = 'test_answers';

    protected $dates = ['created_at', 'updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'question_id', 'order', 'title', 'correct'
    ];

    public function scopeOrder($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function question()
    {
        return $this->belongsTo(TestQuestion::class);
    }
}