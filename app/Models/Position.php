<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = [
        'name'
    ];

    public function programs()
    {
        return $this->belongsToMany('App\Models\Program', 'program_has_positions');
    }
}