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

class SendTestResultMutation extends Mutation
{
    protected $attributes = [
        'name' => 'sendTestResult',
    ];

    public function type()
    {
        return GraphQL::type('Test');
    }

    public function args()
    {
        return [
            'test_id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'report' => [
                'type' => Type::string(),
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        if (!$test = Test::find($args['test_id'])) {
            return new \Exception('Test not found');
        }

        if (!empty($args['report'])) {
            $report = json_decode($args['report']);
            foreach ($report as $row) {

            }
        }

        $user_id = auth()->user()->id;
        $test->results()->create([
            'report' => $args['report'],
            'user_id' => $user_id
        ]);

        $test->start();

        return $test;
    }
}
