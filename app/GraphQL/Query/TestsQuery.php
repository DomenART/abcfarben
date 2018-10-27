<?php

namespace App\GraphQL\Query;

use App\Models\Test;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class TestsQuery extends Query
{
    protected $attributes = [
        'name' => 'tests'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Test'));
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
            return Test::where('id' , $args['id'])->get();
        } else {
            return Test::all();
        }
    }
}
