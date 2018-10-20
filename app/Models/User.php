<?php

namespace App\Models;

use Encore\Admin\Traits\AdminBuilder;
use Encore\Admin\Auth\Database\HasPermissions;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Notifications\ResetPassword as ResetPasswordNotification;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    use Authenticatable, CanResetPassword, HasPermissions, AdminBuilder, HasApiTokens, Notifiable, SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'positions', 'roles', 'firstname', 'secondname', 'avatar', 'city', 'country', 'subdivision', 'sphere', 'about', 'email', 'phone', 'skype', 'email_public', 'phone_public', 'skype_public', 'password', 'deleted_at'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Create a new Eloquent model instance.
     *
     * @param array $attributes
     */
    public function __construct(array $attributes = [])
    {
        $connection = config('admin.database.connection') ?: config('database.default');

        $this->setConnection($connection);

        $this->setTable(config('admin.database.users_table'));

        parent::__construct($attributes);
    }

    public function sendPasswordResetNotification($token)
    {
        // Your your own implementation.
        $this->notify(new ResetPasswordNotification($token, $this->getEmailForPasswordReset()));
    }

    public function setPositionsAttribute($positions)
    {
        $this->positions()->detach();
        if ( ! $positions) return;
        if ( ! $this->exists) $this->save();
        $this->positions()->attach($positions);
    }

    public function setRolesAttribute($roles)
    {
        $this->roles()->detach();
        if ( ! $roles) return;
        if ( ! $this->exists) $this->save();
        $this->roles()->attach($roles);
    }

    public function getNameAttribute()
    {
        $name = [];
        if (!empty($this->firstname)) {
            $name[] = $this->firstname;
        }
        if (!empty($this->secondname)) {
            $name[] = $this->secondname;
        }
        return implode(' ', $name);
    }

    public function isOwner()
    {
        return request()->user()->id == $this->id;
    }

    public function positions()
    {
        return $this->belongsToMany('App\Models\Position', 'user_has_positions');
    }

    public function programs()
    {
        return $this->belongsToMany('App\Models\Program', 'program_has_users');
    }

    public function messages()
    {
        return $this->hasMany('App\Models\Message');
    }
}
