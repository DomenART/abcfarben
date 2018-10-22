<?php

namespace App\GraphQL\Query;

use App\Models\Message;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class MessagesQuery extends Query
{
    protected $attributes = [
        'name' => 'messages'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Message'));
    }

    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int()
            ],
            'thread_id' => [
                'name' => 'thread_id',
                'type' => Type::int()
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        $query = Message::query();

        if (isset($args['id'])) {
            $query->where('id' , $args['id']);
        }

        if (isset($args['thread_id'])) {
            $query->where('thread_id' , $args['thread_id']);
        }

        $result = $query->get();

        return $result;
    }
}
