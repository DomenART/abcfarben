<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Jenssegers\Date\Date;

class MessageSpecified extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'files' => $this->files,
            'created_at' => Date::parse($this->created_at)->diffForHumans(),
            'avatar' => $this->user->avatar,
            'author' => $this->user->name,
            'owner' => $this->user->id == $request->user()->id,
        ];
    }

}