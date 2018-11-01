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
                'type' => Type::nonNull(Type::int())
            ],
            'report' => [
                'type' => Type::listOf(Type::int())
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        if (!$test = Test::find($args['test_id'])) {
            return new \Exception('Test not found');
        }

        $user_id = auth()->user()->id;
        $report = collect();
        $success_count = 0;
        $total = $test->answers()->count();

        foreach ($test->answers()->get() as $answer) {
            $found = array_search($answer->id, $args['report']);
            if ($found !== false) {
                if ($answer->correct) {
                    $success_count++;
                    $report->push([
                        'id' => $answer->id,
                        'checked' => true,
                        'success' => true
                    ]);
                } else {
                    $report->push([
                        'id' => $answer->id,
                        'checked' => true,
                        'success' => false
                    ]);
                }
            } else {
                if (!$answer->correct) {
                    $success_count++;
                } else {
                    $report->push([
                        'id' => $answer->id,
                        'checked' => false,
                        'success' => false
                    ]);
                }
            }
        }

        $percent = round($success_count / $total * 100);
        $success = $success_count === $total;
        if ($test->task->type === 'test') {
            if ($test->type === 'fixation') {
                if ($success) {
                    $test->task->setSuccess();
                }
            }
            if ($test->type === 'evaluation') {
                if (!empty($test->auto) && $test->auto < $percent) {
                    $test->task->setSuccess();
                }
            }
        }

        $test->results()->updateOrCreate([
            'user_id' => $user_id
        ], [
            'report' => $report->toArray(),
            'success' => $success,
            'percent' => $percent
        ]);

        return $test;
    }
}
