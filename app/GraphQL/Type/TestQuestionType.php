<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class TestQuestionType extends BaseType
{
    protected $attributes = [
        'name' => 'TestQuestion'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'title' => [
                'type' => Type::string(),
            ],
            // 'order' => [
            //     'type' => Type::int(),
            // ],
            'answers' => [
                'type' => Type::listOf(GraphQL::type('TestAnswer'))
            ],
        ];
    }

    protected function resolveAnswersField($root, $args)
    {
        return $root->answers()->order()->get();
    }
}