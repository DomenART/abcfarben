<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProgramListing extends JsonResource
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
            'name' => $this->name,
            'status' => $this->getStatus(),
            'image' => $this->image,
            'annotation' => $this->annotation,
            'completed_time' => $this->getCompletedTime(),
            'be_completed_time' => $this->getBeCompletedTime(),
            'passing_time' => $this->getPassingTime(),
            'content' => $this->content,
        ];
    }

}