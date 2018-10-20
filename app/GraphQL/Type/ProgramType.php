<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class ProgramType extends BaseType
{
    protected $attributes = [
        'name' => 'ProgramType',
        'description' => 'A type'
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
            'status' => [
                'type' => Type::string(),
            ],
            'image' => [
                'type' => Type::string(),
            ],
            'annotation' => [
                'type' => Type::string(),
            ],
            'completed_time' => [
                'type' => Type::string(),
            ],
            'be_completed_time' => [
                'type' => Type::string(),
            ],
            'passing_time' => [
                'type' => Type::string(),
            ],
            'content' => [
                'type' => Type::string(),
            ],
            'has_access' => [
                'type' => Type::boolean(),
            ],
            'progress' => [
                'type' => GraphQL::type('Progress')
            ],
            'modules' => [
                'type' => Type::listOf(GraphQL::type('Module'))
            ],
        ];
    }

    protected function resolveCompletedTimeField($root, $args)
    {
        return $root->getCompletedTime();
    }

    protected function resolveBeCompletedTimeField($root, $args)
    {
        return $root->getBeCompletedTime();
    }

    protected function resolvePassingTimeField($root, $args)
    {
        return $root->getPassingTime();
    }

    protected function resolveStatusField($root, $args)
    {
        return $root->getStatus();
    }

    protected function resolveHasAccessField($root, $args)
    {
        return $root->isHasAccess();
    }

    protected function resolveProgressField($root, $args)
    {
        return $root->getProgress();
    }
}
