<?php

namespace App\GraphQL\Query;

use App\Models\User;
use App\Models\Program;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class UsersQuery extends Query
{
    protected $attributes = [
        'name' => 'UsersQuery'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('User'));
    }

    public function args()
    {
        return [
            'id' => ['name' => 'id', 'type' => Type::int()],
            'email' => ['name' => 'email', 'type' => Type::string()],
            'search' => ['name' => 'search', 'type' => Type::string()],
            'program' => ['name' => 'program', 'type' => Type::int()],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        $query = User::query();

        if (isset($args['id'])) {
            $query->where('id' , $args['id']);
        }

        if (isset($args['email'])) {
            $query->where('email', $args['email']);
        }

        if (isset($args['search'])) {
            $search = $args['search'];
            $query->where(function($query) use ($search) {
                $query->where('firstname', 'like', '%' . $search . '%');
                $query->orWhere('secondname', 'like', '%' . $search . '%');
                $query->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        if (isset($args['program'])) {
            $program_id = $args['program'];
            $query->whereHas('programs', function ($query) use($program_id) {
                $query->where('programs.id', $program_id);
            });
        }

        $result = $query->get();

        if (isset($args['program'])) {
            $program = Program::find($args['program']);
            $result = $result->map(function($row) use ($program) {
                $row->progress = $program->getProgress($row->id);
                return $row;
            });
        }

        return $result;
    }
}
