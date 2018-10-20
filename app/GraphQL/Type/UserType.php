<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use GraphQL;

class UserType extends BaseType
{
    protected $attributes = [
        'name' => 'UserType'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the user'
            ],
            'email' => [
                'type' => Type::nonNull(Type::string()),
                'rules' => ['email', 'unique:users']
            ],
            'name' => [
                'type' => Type::string(),
            ],
            'firstname' => [
                'type' => Type::nonNull(Type::string())
            ],
            'secondname' => [
                'type' => Type::string(),
            ],
            'avatar' => [
                'type' => Type::string(),
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
            'email_public' => [
                'type' => Type::boolean(),
            ],
            'phone' => [
                'type' => Type::string(),
            ],
            'phone_public' => [
                'type' => Type::boolean(),
            ],
            'skype' => [
                'type' => Type::string(),
            ],
            'skype_public' => [
                'type' => Type::boolean(),
            ],
            'positions' => [
                'type' => Type::listOf(GraphQL::type('Position'))
            ],
            'progress' => [
                'type' => GraphQL::type('Progress')
            ],
        ];
    }

    protected function isOwner($id) {
        $current = false;
        if (auth()->check()) {
            if (auth()->user()->id === $id) {
                $current = true;
            }
        }
        return $current;
    }

    protected function resolveNameField($root, $args)
    {
        $parts = [];
        if (!empty($root->firstname)) {
            $parts[] = $root->firstname;
        }
        if (!empty($root->lastname)) {
            $parts[] = $root->lastname;
        }
        return implode(' ', $parts);
    }

    protected function resolveEmailField($root, $args)
    {
        if (!$root->email_public && !$this->isOwner($root->id)) {
            return '';
        } else {
            return $root->email;
        }
    }

    protected function resolvePhoneField($root, $args)
    {
        if (!$root->phone_public && !$this->isOwner($root->id)) {
            return '';
        } else {
            return $root->phone;
        }
    }

    protected function resolveSkypeField($root, $args)
    {
        if (!$root->skype_public && !$this->isOwner($root->id)) {
            return '';
        } else {
            return $root->skype;
        }
    }
}
