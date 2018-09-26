<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class Status extends Model
{
    protected $dates = ['created_at', 'updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'statusable_id', 'statusable_type', 'user_id', 'status', 'created_at', 'updated_at'
    ];

    public function setPrimary()
    {
        $this->status = 0;
        $this->save();
        return $this;
    }

    public function scopeOwner($query)
    {
        $user_id = request()->user()->id;
        return $query->where('user_id', $user_id);
    }

    public function scopeUser($query, $user_id)
    {
        return $query->where('user_id', $user_id);
    }

    public function scopePrimary($query)
    {
        return $query->where('status', 0);
    }

    public function scopeSuccess($query)
    {
        return $query->where('status', 1);
    }

    public function scopeWarning($query)
    {
        return $query->where('status', 2);
    }

    public function scopeDanger($query)
    {
        return $query->where('status', 3);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function statusable()
    {
        return $this->morphTo();
    }
}