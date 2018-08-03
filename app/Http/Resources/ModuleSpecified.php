<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ModuleSpecified extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request)
    {
        $tasks = $this->tasks->map(function($task) {
            /**
             * @var \App\Models\Task $task
             */
            $status = $task->statuses()->owner()->first();

            return [
                'id' => $task->id,
                'name' => $task->name,
                'status' => $status ? $status->status : 0
            ];
        });

        return [
            'id' => $this->id,
            'name' => $this->name,
            'content' => $this->content,
            'tasks' => $tasks,
            'opened' => $this->isOpenedByPrevious($request->program),
            'nextTask' => $this->getNextTask(),
            'nextModule' => $this->getNextModule($request->program)
        ];
    }

}