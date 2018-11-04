<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;
use App\Models\ProgramMember;

class ProgramType extends BaseType
{
    protected $attributes = [
        'name' => 'Program'
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
            'status' => [
                'type' => Type::string(),
            ],
            'image' => [
                'type' => Type::string(),
            ],
            'annotation' => [
                'type' => Type::string(),
            ],
            'completed_time' => [
                'type' => Type::string(),
            ],
            'be_completed_time' => [
                'type' => Type::string(),
            ],
            'passing_time' => [
                'type' => Type::string(),
            ],
            'content' => [
                'type' => Type::string(),
            ],
            'has_access' => [
                'type' => Type::boolean(),
            ],
            'progress' => [
                'type' => GraphQL::type('Progress')
            ],
            'modules' => [
                'type' => Type::listOf(GraphQL::type('Module'))
            ],
            'expert_thread_id' => [
                'type' => Type::int(),
                'args' => [
                    'member_id' => ['type' => Type::int()],
                ]
            ],
            'expert_dialog_title' => [
                'type' => Type::string(),
            ],
            'expert_dialog_content' => [
                'type' => Type::string(),
            ],
            'curator_thread_id' => [
                'type' => Type::int(),
                'args' => [
                    'member_id' => ['type' => Type::int()],
                ]
            ],
            'curator_dialog_title' => [
                'type' => Type::string(),
            ],
            'curator_dialog_content' => [
                'type' => Type::string(),
            ],
            'member' => [
                'type' => GraphQL::type('Member')
            ],
        ];
    }

    protected function resolveCompletedTimeField($root, $args)
    {
        return $root->getCompletedTime();
    }

    protected function resolveBeCompletedTimeField($root, $args)
    {
        return $root->getBeCompletedTime();
    }

    protected function resolvePassingTimeField($root, $args)
    {
        return $root->getPassingTime();
    }

    protected function resolveStatusField($root, $args)
    {
        return $root->getStatus();
    }

    protected function resolveHasAccessField($root, $args)
    {
        return $root->isHasAccess();
    }

    protected function resolveProgressField($root, $args)
    {
        return $root->getProgress();
    }

    protected function resolveMemberField($root, $args)
    {
        if ($member = $root->members()->owner()->first()) {
            return [
                'curator' => $member->curator
            ];
        }

        return null;
    }

    // protected function resolveExpertThreadIdField($root, $args)
    // {
    //     $user_id = auth()->user()->id;
    //     if ($thread = $root->threads()->firstOrCreate([
    //         'student_id' => $user_id,
    //         'program_id' => $root->id,
    //         'expert_id' => $root->expert_id
    //     ])) {
    //         return $thread->id;
    //     }
    //     return null;
    // }

    protected function resolveExpertThreadIdField($root, $args)
    {
        if (!empty($args['member_id'])) {
            // TODO: продумать лучше проверку доступа
            if (!auth()->user()->isRole('expert')) {
                throw new \Exception('Access denied');
            }
            $member = ProgramMember::find($args['member_id']);
        } else {
            $member = ProgramMember::where([
                'student_id' => auth()->user()->id,
                'program_id' => $root->id
            ])->first();
        }

        if ($member && $thread = $root->threads()->firstOrCreate([
            'student_id' => $member->student_id,
            'program_id' => $member->program_id,
            'expert_id' => $root->expert_id
        ])) {
            return $thread->id;
        }

        return null;
    }

    protected function resolveCuratorThreadIdField($root, $args)
    {
        if (!empty($args['member_id'])) {
            // TODO: продумать лучше проверку доступа
            if (!auth()->user()->isRole('curator')) {
                throw new \Exception('Access denied');
            }
            $member = ProgramMember::find($args['member_id']);
        } else {
            $member = ProgramMember::where([
                'student_id' => auth()->user()->id,
                'program_id' => $root->id
            ])->first();
        }

        if ($member && $thread = $root->threads()->firstOrCreate([
            'student_id' => $member->student_id,
            'program_id' => $member->program_id,
            'curator_id' => $member->curator_id
        ])) {
            return $thread->id;
        }

        return null;
    }
}
