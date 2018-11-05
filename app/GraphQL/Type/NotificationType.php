<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use Jenssegers\Date\Date;
use GraphQL;

class NotificationType extends BaseType
{
    protected $attributes = [
        'name' => 'Notification'
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
            'group' => [
                'type' => Type::string(),
            ],
            'user_id' => [
                'type' => Type::int(),
            ],
            'icon' => [
                'type' => Type::string(),
            ],
            'uri' => [
                'type' => Type::string(),
            ],
            // 'data' => [
            //     'type' => Type::string(),
            // ],
            // 'data' => [
            //     'type' => Type::listOf(Type::string()),
            // ],
        ];
    }
}