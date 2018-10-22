<?php

namespace App\GraphQL\Query;

use App\Models\User;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\Type;
use GraphQL;

class CurrentUserQuery extends Query
{
    protected $attributes = [
        'name' => 'currentUser'
    ];

    public function type()
    {
        return GraphQL::type('User');
    }

    public function args()
    {
        return [];
    }

    public function resolve()
    {
      if (!auth()->check()) {
        throw new \Exception('User is not logged in');
      }

      return auth()->user();
    }
}
