<?php

namespace App\GraphQL\Mutation;

use App\Models\Module;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class ReadModuleMutation extends Mutation
{
    protected $attributes = [
        'name' => 'readModule',
    ];

    public function type()
    {
        return GraphQL::type('Module');
    }

    public function args()
    {
        return [
            'module_id' => [
                'type' => Type::nonNull(Type::int()),
            ],
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        /**
         * @var Module
         */
        $module = Module::find($args['module_id']);

        if (!$module = Module::find($args['module_id'])) {
            return new \Exception('Module not found');
        }

        if (!$module->isHasAccess()) {
            return new \Exception('You do not have access to the Module');
        }

        if ($module->tasks()->count()) {
            return new \Exception('Выполните задания модуля');
        }

        $module->read();

        return $module;
    }
}
