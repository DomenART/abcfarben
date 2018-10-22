<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use Jenssegers\Date\Date;
use GraphQL;

class MessageType extends BaseType
{
    protected $attributes = [
        'name' => 'Message'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'read' => [
                'type' => Type::boolean(),
            ],
            'body' => [
                'type' => Type::string(),
            ],
            'created_at' => [
                'type' => Type::string(),
            ],
            'files' => [
                'type' => Type::listOf(Type::string()),
            ],
            'user' => [
                'type' => GraphQL::type('User')
            ],
            'owner' => [
                'type' => Type::boolean(),
            ],
        ];
    }

    protected function resolveOwnerField($root, $args)
    {
        return $root->user_id === auth()->user()->id;
    }

    protected function resolveCreatedAtField($root, $args)
    {
        return Date::parse($root->created_at)->diffForHumans();
    }
}