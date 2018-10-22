<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserSpecified extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request)
    {
        // 'positions', 'roles', 'name', 'avatar', 'city', 'country', 'subdivision', 'sphere', 'email', 'phone', 'skype', 'email_public', 'phone_public', 'skype_public', 'password', 'deleted_at'
        $owner = $request->user()->id == $this->id;

        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'firstname' => $this->firstname,
            'secondname' => $this->secondname,
            'avatar' => $this->avatar,
            'city' => $this->city,
            'country' => $this->country,
            'subdivision' => $this->subdivision,
            'sphere' => $this->sphere,
            'about' => $this->about,
            'email_public' => $this->email_public,
            'phone_public' => $this->phone_public,
            'skype_public' => $this->skype_public,
            'roles' => $this->roles,
        ];

        if ($this->email_public || $this->isOwner()) {
            $data['email'] = $this->email;
        }

        if ($this->phone_public || $this->isOwner()) {
            $data['phone'] = $this->phone;
        }

        if ($this->skype_public || $this->isOwner()) {
            $data['skype'] = $this->skype;
        }

        return $data;
    }

}