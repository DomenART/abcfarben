<?php

namespace App\GraphQL\Query;

use App\Models\Question;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class QuestionsQuery extends Query
{
    protected $attributes = [
        'name' => 'questions'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Question'));
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
            return Question::where('id' , $args['id'])->get();
        } else {
            return Question::all();
        }
    }
}
