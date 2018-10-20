<?php

namespace App\GraphQL\Query;

use App\Models\Program;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class ProgramsQuery extends Query
{
    protected $attributes = [
        'name' => 'ProgramsQuery'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Program'));
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
            return Program::where('id' , $args['id'])->get();
        } else {
            return Program::all();
        }
    }
}
