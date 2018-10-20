<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class LessonType extends BaseType
{
    protected $attributes = [
        'name' => 'LessonType'
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
            'content' => [
                'type' => Type::string(),
            ],
            'status' => [
                'type' => Type::string(),
            ],
            'previous_lesson_id' => [
                'type' => Type::int(),
            ],
            'next_lesson_id' => [
                'type' => Type::int(),
            ],
            'task' => [
                'type' => GraphQL::type('Task')
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

    protected function resolvePreviousLessonIdField($root, $args)
    {
        if ($lesson = $root->getPrevious()) {
            return $lesson->id;
        }
        return null;
    }

    protected function resolveNextLessonIdField($root, $args)
    {
        if ($lesson = $root->getNext()) {
            return $lesson->id;
        }
        return null;
    }

    protected function resolveHasAccessField($root, $args)
    {
        return $root->isHasAccess();
    }
}