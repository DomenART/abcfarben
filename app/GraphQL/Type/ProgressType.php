<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class ProgressType extends BaseType
{
    protected $attributes = [
        'name' => 'ProgressType'
    ];

    public function fields()
    {
        return [
            'done' => [
                'type' => Type::string()
            ],
            'available' => [
                'type' => Type::string()
            ],
            'total' => [
                'type' => Type::string()
            ],
        ];
    }
}
