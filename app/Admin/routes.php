<?php

use Illuminate\Routing\Router;

Admin::registerAuthRoutes();

Route::group([
    'prefix'        => config('admin.route.prefix'),
    'namespace'     => config('admin.route.namespace'),
    'middleware'    => config('admin.route.middleware'),
], function (Router $router) {
    $router->get('auth/login', 'AuthController@getLogin');
    $router->post('auth/login', 'AuthController@postLogin');
    $router->get('auth/logout', 'AuthController@getLogout');
    $router->get('auth/setting', 'AuthController@getSetting');
    $router->put('auth/setting', 'AuthController@putSetting');

    $router->get('/', 'HomeController@index');
    $router->post('api/ckeditor5/upload', 'CKEditor5Controller@upload');

    // programs
    $router->get('api/programs/filter/list', 'ProgramController@filterList');

    // modules
    $router->get('api/modules/filter/list', 'ModuleController@filterList');
    $router->get('api/modules/list', 'ModuleController@list');
    $router->post('api/modules/sort', 'ModuleController@sort');
    $router->post('api/modules/bind', 'ModuleController@bind');
    $router->delete('api/modules/unbind/{id}', 'ModuleController@unbind');

    // tasks
    $router->get('api/tasks/filter/list', 'TaskController@filterList');
    $router->get('api/tasks/list', 'TaskController@list');
    $router->post('api/tasks/sort', 'TaskController@sort');

    // lessons
    $router->get('api/lessons/list', 'LessonController@list');
    $router->post('api/lessons/sort', 'LessonController@sort');

    $router->resources([
        'lessons' => LessonController::class,
        'tasks' => TaskController::class,
        'modules' => ModuleController::class,
        'positions' => PositionController::class,
        'programs' => ProgramController::class,
        'statuses' => ProgramStatusController::class,
        'auth/users' => UserController::class,
        'events' => EventController::class,
    ]);
});
