<?php

namespace App\GraphQL\Mutation;

use App\Models\Lesson;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Axe\LaravelGraphQLUpload\UploadType;
use Illuminate\Support\Facades\Hash;
use GraphQL;

class ReadLessonMutation extends Mutation
{
    protected $attributes = [
        'name' => 'readLesson',
    ];

    public function type()
    {
        return GraphQL::type('Lesson');
    }

    public function args()
    {
        return [
            'lesson_id' => [
                'type' => Type::nonNull(Type::int()),
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        /**
         * @var Lesson
         */
        $lesson = Lesson::find($args['lesson_id']);

        if (!$lesson = Lesson::find($args['lesson_id'])) {
            return new \Exception('Lesson not found');
        }

        if (!$lesson->isHasAccess()) {
            return new \Exception('You do not have access to the Lesson');
        }

        $lesson->read();

        return $lesson;
    }
}
