<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'program_id', 'question', 'answer', 'order'
    ];

    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id');
    }
}