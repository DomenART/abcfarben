<?php

namespace App\GraphQL\Mutation;

use App\Models\Notification;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Axe\LaravelGraphQLUpload\UploadType;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image;
use GraphQL;

class DeleteNotificationMutation extends Mutation
{
    protected $attributes = [
        'name' => 'deleteNotification',
    ];

    public function type()
    {
        return GraphQL::type('Notification');
    }

    public function args()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int())
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        if (!$user = auth()->user()) {
            return new \Exception('User is not logged in');
        }

        if (!$notification = Notification::find($args['id'])) {
            return new \Exception('Notification not found');
        }

        if ($notification->user_id != $user->id) {
            return new \Exception('Operation not allowed');
        }

        $notification->delete();

        return null;
    }
}
