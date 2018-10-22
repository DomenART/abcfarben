<?php

namespace App\GraphQL\Mutation;

use App\Models\Message;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Axe\LaravelGraphQLUpload\UploadType;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image;
use GraphQL;

class SendMessageMutation extends Mutation
{
    protected $attributes = [
        'name' => 'sendMessage',
    ];

    public function type()
    {
        return GraphQL::type('Message');
    }

    public function args()
    {
        return [
            'files' => [
                'type' => Type::listOf(UploadType::type()),
            ],
            'body' => [
                'type' => Type::string(),
            ],
            'thread_id' => [
                'type' => Type::nonNull(Type::int()),
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        if (!$user = auth()->user()) {
            return new \Exception('User is not logged in');
        }

        $message = Message::create([
            'thread_id' => $args['thread_id'],
            'user_id' => $user->id,
            'body' => $args['body'],
        ]);

        if ($args['files']) {
            $id = $message->id;
            $message->files = collect($args['files'])->map(function($file) use ($id) {
                return $file->storeAs('messages/' . $id, $file->getClientOriginalName(), 'public');
            });
            $message->save();
        }

        // $message->createNotifications();

        return $message;
    }
}
