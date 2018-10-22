<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class ModuleType extends BaseType
{
    protected $attributes = [
        'name' => 'Module'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int())
            ],
            'name' => [
                'type' => Type::string()
            ],
            'content' => [
                'type' => Type::string()
            ],
            'status' => [
                'type' => Type::string()
            ],
            'next_module_id' => [
                'type' => Type::int(),
                'args' => [
                    'program' => ['type' => Type::nonNull(Type::int())]
                ]
            ],
            'opened' => [
                'type' => Type::int(),
                'args' => [
                    'program' => ['type' => Type::nonNull(Type::int())]
                ]
            ],
            'next_task_id' => [
                'type' => Type::int()
            ],
            'tasks' => [
                'type' => Type::listOf(GraphQL::type('Task'))
            ],
            'has_access' => [
                'type' => Type::boolean(),
            ],
        ];
    }

    protected function resolveTasksField($root, $args)
    {
        return $root->tasks()->order()->get();
    }

    protected function resolveStatusField($root, $args)
    {
        return $root->getStatus();
    }

    protected function resolveNextTaskIdField($root, $args)
    {
        return $root->getNextTaskId();
    }

    protected function resolveNextModuleIdField($root, $args)
    {
        return $root->getNextModuleId($args['program']);
    }

    protected function resolveOpenedField($root, $args)
    {
        return $root->isOpenedByPrevious($args['program']);
    }

    protected function resolveHasAccessField($root, $args)
    {
        return $root->isHasAccess();
    }
}
