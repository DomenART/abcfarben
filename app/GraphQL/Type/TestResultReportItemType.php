<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class TestResultReportItemType extends BaseType
{
    protected $attributes = [
        'name' => 'TestResultReportItem'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'checked' => [
                'type' => Type::boolean(),
            ],
            'success' => [
                'type' => Type::boolean(),
            ],
        ];
    }
}