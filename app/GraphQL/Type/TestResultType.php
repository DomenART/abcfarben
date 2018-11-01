<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class TestResultType extends BaseType
{
    protected $attributes = [
        'name' => 'TestResult'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            // 'test' => [
            //     'type' => GraphQL::type('Test'),
            // ],
            // 'user' => [
            //     'type' => GraphQL::type('User'),
            // ],
            'report' => [
                'type' => Type::listOf(GraphQL::type('TestResultReportItem'))
            ],
            'percent' => [
                'type' => Type::int(),
            ],
            'success' => [
                'type' => Type::boolean(),
            ],
        ];
    }
}