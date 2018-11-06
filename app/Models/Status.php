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

    public function getLabel()
    {
        switch ($this->status) {
            case 0: return 'primary'; break;
            case 1: return 'success'; break;
            case 2: return 'warning'; break;
            case 3: return 'danger'; break;
            default: return 'primary';
        }
    }

    public function setPrimary()
    {
        $this->status = 0;
        $this->save();
        return $this;
    }

    public function setSuccess()
    {
        $this->status = 1;
        $this->save();
        return $this;
    }

    public function setWarning()
    {
        $this->status = 2;
        $this->save();
        return $this;
    }

    public function setDanger()
    {
        $this->status = 3;
        $this->save();
        return $this;
    }

    public function isPrimary()
    {
        return $this->status === 0;
    }

    public function isSuccess()
    {
        return $this->status === 1;
    }

    public function isWarning()
    {
        return $this->status === 2;
    }

    public function isDanger()
    {
        return $this->status === 3;
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

    /**
     * TODO: Нужно отвязать ветки от статусов
     */
    public function threads()
    {
        return $this->morphMany(Thread::class, 'threadable');
    }
}