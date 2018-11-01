<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

use App\Models\ProgramMember;

class TaskType extends BaseType
{
    protected $attributes = [
        'name' => 'Task'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'name' => [
                'type' => Type::string(),
            ],
            'description' => [
                'type' => Type::string(),
            ],
            'content' => [
                'type' => Type::string(),
            ],
            'order' => [
                'type' => Type::int(),
            ],
            'type' => [
                'type' => Type::string(),
            ],
            'status' => [
                'type' => Type::string(),
                'args' => [
                    'member_id' => ['type' => Type::int()],
                    'student_id' => ['type' => Type::int()]
                ]
            ],
            'first_lesson_id' => [
                'type' => Type::int(),
            ],
            'next_lesson_id' => [
                'type' => Type::int(),
            ],
            'files' => [
                'type' => Type::listOf(Type::string()),
            ],
            'has_access' => [
                'type' => Type::boolean(),
            ],
            'thread_id' => [
                'type' => Type::int(),
                'args' => [
                    'program' => ['type' => Type::int()],
                    'student_id' => ['type' => Type::int()]
                ]
            ],
            'module' => [
                'type' => GraphQL::type('Module')
            ],
            'test' => [
                'type' => GraphQL::type('Test')
            ],
            'statuses' => [
                'type' => Type::listOf(GraphQL::type('Status')),
                'args' => [
                    'member_id' => ['type' => Type::int()],
                    'student_id' => ['type' => Type::int()]
                ]
            ],
        ];
    }

    protected function resolveContentField($root, $args)
    {
        if (auth()->check() && auth()->user()->isRole('curator')) {
            return $root->content;
        }

        if (!$root->isHasAccess()) {
            return null;
        }

        return $root->content;
    }

    protected function resolveFilesField($root, $args)
    {
        if (auth()->check() && auth()->user()->isRole('curator')) {
            return $root->files;
        }

        if (!$root->isHasAccess()) {
            return null;
        }

        return $root->files;
    }

    protected function resolveStatusField($root, $args)
    {
        $statuses = $root->statuses();
        // TODO: нужна проверка на роль, получить данные может только куратор
        if (!empty($args['member_id'])) {
            $member = ProgramMember::find($args['member_id']);
            $statuses->user($member->student_id);
        } else if (!empty($args['student_id'])) {
            $statuses->user($args['student_id']);
        } else {
            $statuses->owner();
        }
        if ($status = $statuses->latest()->first()) {
            return $status->getLabel();
        }
        return null;
    }

    protected function resolveStatusesField($root, $args)
    {
        $statuses = $root->statuses();
        // TODO: нужна проверка на роль, получить данные может только куратор
        if (!empty($args['member_id'])) {
            $member = ProgramMember::find($args['member_id']);
            $statuses->user($member->student_id);
        } else if (!empty($args['student_id'])) {
            $statuses->user($args['student_id']);
        } else {
            $statuses->owner();
        }

        return $statuses->latest()->get();
    }

    protected function resolveFirstLessonIdField($root, $args)
    {
        return $root->getFirstLessonId();
    }

    protected function resolveNextLessonIdField($root, $args)
    {
        return $root->getNextLessonId();
    }

    protected function resolveHasAccessField($root, $args)
    {
        return $root->isHasAccess();
    }

    protected function resolveThreadIdField($root, $args)
    {
        if (!empty($args['student_id'])) {
            // TODO: продумать лучше проверку доступа
            if (!auth()->user()->isRole('curator')) {
                throw new \Exception('Access denied');
            }
            $user_id = $args['student_id'];
        } else {
            $user_id = auth()->user()->id;
        }

        if ($thread = $root->threads()->where('student_id', $user_id)->first()) {
            return $thread->id;
        }

        $params = ['student_id' => $user_id];
        if (!empty($args['program'])) {
            $params['program_id'] = $args['program'];
        }
        if ($thread = $root->threads()->create($params)) {
            return $thread->id;
        }

        return null;
    }
}