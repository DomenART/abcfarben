<?php

namespace App\GraphQL\Query;

use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

use App\Models\Task;

class TasksQuery extends Query
{
    protected $attributes = [
        'name' => 'TasksQuery'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Task'));
    }

    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int()
            ]
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        $query = Task::query();

        if (isset($args['id'])) {
            $query->where('id', $args['id']);
        }

        $result = $query->get();

        return $result;
    }
}
