<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class EventType extends BaseType
{
    protected $attributes = [
        'name' => 'EventType'
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
            'annotation' => [
                'type' => Type::string(),
            ],
            'content' => [
                'type' => Type::string(),
            ],
        ];
    }
}