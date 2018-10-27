<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class TestAnswerType extends BaseType
{
    protected $attributes = [
        'name' => 'TestAnswer'
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
            // 'correct' => [
            //     'type' => Type::boolean(),
            // ],
        ];
    }
}