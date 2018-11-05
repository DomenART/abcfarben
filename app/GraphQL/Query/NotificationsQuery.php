<?php

namespace App\GraphQL\Query;

use App\Models\Notification;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class NotificationsQuery extends Query
{
    protected $attributes = [
        'name' => 'notifications'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Notification'));
    }

    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int()
            ],
            'user_id' => [
                'name' => 'user_id',
                'type' => Type::int()
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        $query = Notification::query();

        if (isset($args['id'])) {
            $query->where('id' , $args['id']);
        }

        if (isset($args['user_id'])) {
            $query->where('user_id' , $args['user_id']);
        } else {
            $query->owner();
        }

        $result = $query->latest()->get();

        return $result;
    }
}
