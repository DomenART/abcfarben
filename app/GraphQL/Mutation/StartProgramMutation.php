<?php

namespace App\GraphQL\Mutation;

use App\Models\Program;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Axe\LaravelGraphQLUpload\UploadType;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image;
use GraphQL;

class StartProgramMutation extends Mutation
{
    protected $attributes = [
        'name' => 'startProgram',
    ];

    public function type()
    {
        return GraphQL::type('Program');
    }

    public function args()
    {
        return [
            'program_id' => [
                'type' => Type::nonNull(Type::int()),
            ],
        ];
    }

    public function authenticated($root, $args, $currentUser)
    {
        return !!$currentUser;
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        /**
         * @var Program
         */
        $program = Program::find($args['program_id']);

        if (!$program = Program::find($args['program_id'])) {
            return new \Exception('Program not found');
        }

        if (!$program->isHasAccess()) {
            return new \Exception('You do not have access to the program');
        }

        $program->starting();

        return $program;
    }
}
