<?php

namespace App\GraphQL\Mutation;

use App\Models\Test;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Axe\LaravelGraphQLUpload\UploadType;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image;
use GraphQL;
use App\Models\TestAnswer;
use function GuzzleHttp\json_encode;

class ResetTestResultMutation extends Mutation
{
    protected $attributes = [
        'name' => 'resetTestResult',
    ];

    public function type()
    {
        return GraphQL::type('Test');
    }

    public function args()
    {
        return [
            'test_id' => [
                'type' => Type::nonNull(Type::int())
            ],
            'student_id' => [
                'type' => Type::int()
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        if (!$test = Test::find($args['test_id'])) {
            return new \Exception('Test not found');
        }

        // TODO: продумать лучше проверку доступа
        if (!empty($args['student_id']) && !auth()->user()->isRole('curator')) {
            throw new \Exception('Access denied');
        }

        $results = $test->results();
        if (!empty($args['student_id'])) {
            $results->user($args['student_id']);
        } else {
            $results->owner();
        }
        if ($result = $results->first()) {
            $result->delete();
        }

        return $test;
    }
}
