<?php

namespace App\GraphQL\Query;

use App\Models\Event;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class EventsQuery extends Query
{
    protected $attributes = [
        'name' => 'events'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Event'));
    }

    public function args()
    {
        return [
            'id' => ['name' => 'id', 'type' => Type::int()],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        if (isset($args['id'])) {
            return Event::where('id' , $args['id'])->get();
        } else {
            return Event::all();
        }
    }
}
