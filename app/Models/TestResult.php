<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class TestResult extends Model
{
    protected $table = 'test_result';

    protected $casts = [
        'report' => 'array'
    ];

    protected $dates = ['created_at', 'updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'test_id', 'user_id', 'report', 'percent', 'success'
    ];

    public function scopeCorrect($query)
    {
        return $query->where('correct', true);
    }

    public function scopeOwner($query)
    {
        $user_id = auth()->user()->id;
        return $query->where('user_id', $user_id);
    }

    public function scopeUser($query, $user_id)
    {
        return $query->where('user_id', $user_id);
    }

    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}