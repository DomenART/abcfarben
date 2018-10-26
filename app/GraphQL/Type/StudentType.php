<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class StudentType extends BaseType
{
    protected $attributes = [
        'name' => 'Student'
    ];

    public function fields()
    {
        return [
            'curator' => [
                'type' => GraphQL::type('User')
            ],
        ];
    }
}
