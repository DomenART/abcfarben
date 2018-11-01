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

class UpdateTestResultMutation extends Mutation
{
    protected $attributes = [
        'name' => 'updateTestResult',
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
                'type' => Type::nonNull(Type::int())
            ],
            'success' => [
                'type' => Type::boolean()
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        // TODO: продумать лучше проверку доступа
        if (!auth()->user()->isRole('curator')) {
            throw new \Exception('Access denied');
        }

        if (!$test = Test::find($args['test_id'])) {
            return new \Exception('Test not found');
        }

        $result = $test->results()->user($args['student_id'])->first();
        $result->success = $args['success'];
        $result->save();

        return $test;
    }
}
