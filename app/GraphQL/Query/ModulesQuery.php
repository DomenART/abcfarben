<?php

namespace App\GraphQL\Query;

use App\Models\Module;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use GraphQL;

class ModulesQuery extends Query
{
    protected $attributes = [
        'name' => 'modules'
    ];

    public function type()
    {
        return Type::listOf(GraphQL::type('Module'));
    }

    public function args()
    {
        return [
            'id' => ['name' => 'id', 'type' => Type::int()]
        ];
    }

    public function resolve($root, $args, $context, ResolveInfo $info)
    {
        $query = Module::query();

        if (isset($args['id'])) {
            $query->where('id', $args['id']);
        }

        $result = $query->get();

        // if (isset($args['program'])) {
        //     $program_id = $args['program'];
        //     $result = $result->map(function($row) use ($program_id) {
        //         $row->opened = $row->isOpenedByPrevious($program_id);
        //         $row->next_module = $row->getNextModule($program_id);
        //         return $row;
        //     });
        // }

        return $result;
    }
}
