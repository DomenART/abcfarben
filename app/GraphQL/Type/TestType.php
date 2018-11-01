<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class TestType extends BaseType
{
    protected $attributes = [
        'name' => 'Test'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'auto' => [
                'type' => Type::int(),
            ],
            'time' => [
                'type' => Type::int(),
            ],
            'type' => [
                'type' => Type::string(),
            ],
            'questions' => [
                'type' => Type::listOf(GraphQL::type('TestQuestion'))
            ],
            'result' => [
                'type' => GraphQL::type('TestResult'),
                'args' => [
                    'student_id' => ['type' => Type::int()]
                ]
            ],
            'task' => [
                'type' => GraphQL::type('Task')
            ],
        ];
    }

    protected function resolveQuestionsField($root, $args)
    {
        return $root->questions()->order()->get();
    }

    protected function resolveResultField($root, $args)
    {
        // TODO: продумать лучше проверку доступа
        if (!empty($args['student_id']) && !auth()->user()->isRole('curator')) {
            throw new \Exception('Access denied');
        }

        $results = $root->results();
        if (!empty($args['student_id'])) {
            $results->user($args['student_id']);
        } else {
            $results->owner();
        }
        if ($result = $results->first()) {
            return $result;
        }

        return null;
    }
}