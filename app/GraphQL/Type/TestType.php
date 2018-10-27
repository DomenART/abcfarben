<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class TestType extends BaseType
{
    protected $attributes = [
        'name' => 'Test'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'auto' => [
                'type' => Type::int(),
            ],
            'time' => [
                'type' => Type::int(),
            ],
            'questions' => [
                'type' => Type::listOf(GraphQL::type('TestQuestion'))
            ],
        ];
    }

    protected function resolveQuestionsField($root, $args)
    {
        return $root->questions()->order()->get();
    }
}