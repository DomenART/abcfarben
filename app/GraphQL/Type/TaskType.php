<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class TaskType extends BaseType
{
    protected $attributes = [
        'name' => 'TaskType'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'name' => [
                'type' => Type::string(),
            ],
            'description' => [
                'type' => Type::string(),
            ],
            'content' => [
                'type' => Type::string(),
            ],
            'order' => [
                'type' => Type::int(),
            ],
            'solo' => [
                'type' => Type::boolean(),
            ],
            'status' => [
                'type' => Type::string(),
            ],
            'first_lesson_id' => [
                'type' => Type::int(),
            ],
            'next_lesson_id' => [
                'type' => Type::int(),
            ],
            'files' => [
                'type' => Type::listOf(Type::string()),
            ],
            'has_access' => [
                'type' => Type::boolean(),
            ],
        ];
    }

    protected function resolveStatusField($root, $args)
    {
        return $root->getStatus();
    }

    protected function resolveFirstLessonIdField($root, $args)
    {
        return $root->getFirstLessonId();
    }

    protected function resolveNextLessonIdField($root, $args)
    {
        return $root->getNextLessonId();
    }

    protected function resolveHasAccessField($root, $args)
    {
        return $root->isHasAccess();
    }
}