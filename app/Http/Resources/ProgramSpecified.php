<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProgramSpecified extends JsonResource
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
            'annotation' => $this->annotation,
            'dialog_title' => $this->dialog_title,
            'dialog_content' => $this->dialog_content,
            'hasAccess' => $this->ownerHasAccess()
        ];
    }

}