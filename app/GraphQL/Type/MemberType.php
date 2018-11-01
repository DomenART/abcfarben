<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class MemberType extends BaseType
{
    protected $attributes = [
        'name' => 'Member'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'curator' => [
                'type' => GraphQL::type('User')
            ],
            'student' => [
                'type' => GraphQL::type('User')
            ],
            'program' => [
                'type' => GraphQL::type('Program')
            ],
        ];
    }
}
