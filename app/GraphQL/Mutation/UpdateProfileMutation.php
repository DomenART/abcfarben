<?php

namespace App\GraphQL\Mutation;

use App\Models\User;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Axe\LaravelGraphQLUpload\UploadType;
use GraphQL;

class UpdateProfileMutation extends Mutation
{
    protected $attributes = [
        'name' => 'updateProfile',
    ];

    public function type()
    {
        return GraphQL::type('User');
    }

    public function args()
    {
        return [
            'email' => [
                'type' => Type::nonNull(Type::string()),
                'rules' => ['email']
            ],
            'firstname' => [
                'type' => Type::nonNull(Type::string())
            ],
            'email_public' => [
                'type' => Type::boolean(),
            ],
            'phone_public' => [
                'type' => Type::boolean(),
            ],
            'skype_public' => [
                'type' => Type::boolean(),
            ],
            'secondname' => [
                'type' => Type::string()
            ],
            'city' => [
                'type' => Type::string(),
            ],
            'country' => [
                'type' => Type::string(),
            ],
            'subdivision' => [
                'type' => Type::string(),
            ],
            'sphere' => [
                'type' => Type::string(),
            ],
            'about' => [
                'type' => Type::string(),
            ],
            'phone' => [
                'type' => Type::string(),
            ],
            'skype' => [
                'type' => Type::string(),
            ],
        ];
    }

    public function authenticated($root, $args, $currentUser)
    {
        return !!$currentUser;
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        if (!$user = auth()->user()) {
            return new \Exception('User is not logged in');
        }

        $user->update($args);

        return $user;
    }
}
