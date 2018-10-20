<?php

namespace App\GraphQL\Mutation;

use App\Models\User;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Axe\LaravelGraphQLUpload\UploadType;
use Illuminate\Support\Facades\Hash;
use GraphQL;

class ChangePasswordMutation extends Mutation
{
    protected $attributes = [
        'name' => 'changePassword',
    ];

    public function type()
    {
        return GraphQL::type('User');
    }

    public function args()
    {
        return [
          'password' => [
              'type' => Type::nonNull(Type::string()),
              'rules' => ['required', 'confirmed']
          ],
          'password_confirmation' => [
              'type' => Type::nonNull(Type::string()),
              'rules' => ['required']
          ]
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

        $user->password = Hash::make($args['password']);
        $user->save();

        return $user;
    }
}
