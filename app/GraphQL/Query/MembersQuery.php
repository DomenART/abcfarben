<?php

namespace App\GraphQL\Query;

use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\Type;
use GraphQL;

use App\Models\User;
use App\Models\Program;
use App\Models\ProgramMember;

class MembersQuery extends Query
{
    protected $attributes = [
        'name' => 'members'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Member'));
    }

    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int()
            ],
            'scope' => [
                'name' => 'scope',
                'type' => Type::string()
            ],
        ];
    }

    public function resolve($root, $args)
    {
        $query = ProgramMember::query();

        if (!empty($args['scope'])) {
            $user_id = auth()->user()->id;
            if ($args['scope'] === 'curator') {
                $query->curator($user_id);
            }
            else if ($args['scope'] === 'expert') {
                $program_ids = Program::where('expert_id', $user_id)->get()->pluck('id')->all();
                $query->whereIn('program_id', $program_ids);
            }
        }

        if (isset($args['id'])) {
            $query->where('id' , $args['id']);
        }

        $members = $query->get();

        return $members;
    }
}