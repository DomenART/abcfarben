<?php

namespace App\GraphQL\Mutation;

use App\Models\Task;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class UpdateTaskStatusMutation extends Mutation
{
    protected $attributes = [
        'name' => 'updateTaskStatus',
    ];

    public function type()
    {
        return GraphQL::type('Task');
    }

    public function args()
    {
        return [
            'task_id' => [
                'type' => Type::nonNull(Type::int())
            ],
            'student_id' => [
                'type' => Type::nonNull(Type::int())
            ],
            'status' => [
                'type' => Type::nonNull(Type::string())
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        // TODO: продумать лучше проверку доступа
        if (!auth()->user()->isRole('curator')) {
            throw new \Exception('Access denied');
        }

        if (!$task = Task::find($args['task_id'])) {
            return new \Exception('Task not found');
        }

        $method = camel_case('set' . $args['status']);
        $status = $task->statuses()->create([
            'user_id' => $args['student_id']
        ])->$method();

        return $task;
    }
}
