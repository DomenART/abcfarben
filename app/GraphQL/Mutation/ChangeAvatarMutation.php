<?php

namespace App\GraphQL\Mutation;

use App\Models\User;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Axe\LaravelGraphQLUpload\UploadType;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image;
use GraphQL;

class ChangeAvatarMutation extends Mutation
{
    protected $attributes = [
        'name' => 'changeAvatar',
    ];

    public function type()
    {
        return GraphQL::type('User');
    }

    public function args()
    {
        return [
          'avatar' => [
              'type' => Type::nonNull(UploadType::type()),
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

        $filename = 'images/' . $args['avatar']->getClientOriginalName();
        $image = Image::make($args['avatar']);
        $image->fit(200);
        $image->save(storage_path('app/public/' . $filename));

        $user->avatar = $filename;
        $user->save();

        return $user;
    }
}
