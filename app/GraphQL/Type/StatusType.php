<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\Type;
use Folklore\GraphQL\Support\Type as BaseType;
use Jenssegers\Date\Date;
use GraphQL;

class StatusType extends BaseType
{
    protected $attributes = [
        'name' => 'Status'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'status' => [
                'type' => Type::string(),
            ],
            'created_at' => [
                'type' => Type::string(),
            ],
        ];
    }

    protected function resolveStatusField($root, $args)
    {
        return $root->getLabel();
    }

    protected function resolveCreatedAtField($root, $args)
    {
        return Date::parse($root->created_at)->diffForHumans();
    }
}