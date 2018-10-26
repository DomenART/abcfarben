<?php

namespace App\GraphQL\Mutation;

use App\Models\Task;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class ReadTaskMutation extends Mutation
{
    protected $attributes = [
        'name' => 'readTask',
    ];

    public function type()
    {
        return GraphQL::type('Task');
    }

    public function args()
    {
        return [
            'task_id' => [
                'type' => Type::nonNull(Type::int()),
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        /**
         * @var Task
         */
        $task = Task::find($args['task_id']);

        if (!$task = Task::find($args['task_id'])) {
            return new \Exception('Task not found');
        }

        if (!$task->isHasAccess()) {
            return new \Exception('You do not have access to the Task');
        }

        if ($task->type !== 'independent') {
            return new \Exception('Задание должен принять куратор');
        }

        $task->read();

        return $task;
    }
}
