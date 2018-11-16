<?php

namespace App\GraphQL\Query;

use App\Models\User;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\Type;
use GraphQL;

class IsAuthenticatedQuery extends Query
{
    protected $attributes = [
        'name' => 'isAuthenticated'
    ];

    public function type()
    {
        return Type::boolean();
    }

    public function args()
    {
        return [];
    }

    public function resolve()
    {
      return true;
      return auth()->check();
    }
}
