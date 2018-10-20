<?php

namespace App\GraphQL\Query;

use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

use App\Models\Lesson;

class LessonsQuery extends Query
{
    protected $attributes = [
        'name' => 'LessonsQuery'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Lesson'));
    }

    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int()
            ]
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        $query = Lesson::query();

        if (isset($args['id'])) {
            $query->where('id', $args['id']);
        }

        $result = $query->get();

        return $result;
    }
}
