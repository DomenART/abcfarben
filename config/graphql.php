<?php


return [

    /*
     * The prefix for routes
     */
    'prefix' => 'graphql',

    /*
     * The domain for routes
     */
    'domain' => null,

    /*
     * The routes to make GraphQL request. Either a string that will apply
     * to both query and mutation or an array containing the key 'query' and/or
     * 'mutation' with the according Route
     *
     * Example:
     *
     * Same route for both query and mutation
     *
     * 'routes' => [
     *     'query' => 'query/{graphql_schema?}',
     *     'mutation' => 'mutation/{graphql_schema?}',
     *      mutation' => 'graphiql'
     * ]
     *
     * you can also disable routes by setting routes to null
     *
     * 'routes' => null,
     */
    'routes' => '{graphql_schema?}',

    /*
     * The controller to use in GraphQL requests. Either a string that will apply
     * to both query and mutation or an array containing the key 'query' and/or
     * 'mutation' with the according Controller and method
     *
     * Example:
     *
     * 'controllers' => [
     *     'query' => '\Folklore\GraphQL\GraphQLController@query',
     *     'mutation' => '\Folklore\GraphQL\GraphQLController@mutation'
     * ]
     */
    'controllers' => \Folklore\GraphQL\GraphQLController::class.'@query',

    /*
     * The name of the input variable that contain variables when you query the
     * endpoint. Most libraries use "variables", you can change it here in case you need it.
     * In previous versions, the default used to be "params"
     */
    'variables_input_name' => 'variables',

    /*
     * Any middleware for the 'graphql' route group
     */
    'middleware' => [
        'auth:api',
        Axe\LaravelGraphQLUpload\GraphqlUploadMiddleware::class
    ],

    /**
     * Any middleware for a specific 'graphql' schema
     */
    'middleware_schema' => [],

    /*
     * Any headers that will be added to the response returned by the default controller
     */
    'headers' => [],

    /*
     * Any JSON encoding options when returning a response from the default controller
     * See http://php.net/manual/function.json-encode.php for the full list of options
     */
    'json_encoding_options' => 0,

    /*
     * Config for GraphiQL (see (https://github.com/graphql/graphiql).
     * To disable GraphiQL, set this to null
     */
    'graphiql' => [
        'routes' => '/graphiql/{graphql_schema?}',
        'controller' => \Folklore\GraphQL\GraphQLController::class.'@graphiql',
        'middleware' => [],
        'view' => 'graphql::graphiql',
        'composer' => \Folklore\GraphQL\View\GraphiQLComposer::class,
    ],

    /*
     * The name of the default schema used when no arguments are provided
     * to GraphQL::schema() or when the route is used without the graphql_schema
     * parameter
     */
    'schema' => 'default',

    /*
     * The schemas for query and/or mutation. It expects an array to provide
     * both the 'query' fields and the 'mutation' fields. You can also
     * provide an GraphQL\Type\Schema object directly.
     *
     * Example:
     *
     * 'schemas' => [
     *     'default' => new Schema($config)
     * ]
     *
     * or
     *
     * 'schemas' => [
     *     'default' => [
     *         'query' => [
     *              'users' => 'App\GraphQL\Query\UsersQuery'
     *          ],
     *          'mutation' => [
     *
     *          ]
     *     ]
     * ]
     */
    'schemas' => [
        'default' => [
            'query' => [
                'events' => 'App\GraphQL\Query\EventsQuery',
                'users' => 'App\GraphQL\Query\UsersQuery',
                'programs' => 'App\GraphQL\Query\ProgramsQuery',
                'modules' => 'App\GraphQL\Query\ModulesQuery',
                'tasks' => 'App\GraphQL\Query\TasksQuery',
                'lessons' => 'App\GraphQL\Query\LessonsQuery',
                'questions' => 'App\GraphQL\Query\QuestionsQuery',
                'messages' => 'App\GraphQL\Query\MessagesQuery',
                'tests' => 'App\GraphQL\Query\TestsQuery',
                'currentUser' => 'App\GraphQL\Query\CurrentUserQuery',
                'members' => 'App\GraphQL\Query\MembersQuery',
                'notifications' => 'App\GraphQL\Query\NotificationsQuery'
            ],
            'mutation' => [
                'updateProfile' => 'App\GraphQL\Mutation\UpdateProfileMutation',
                'createUser' => 'App\GraphQL\Mutation\CreateUserMutation',
                'changePassword' => 'App\GraphQL\Mutation\ChangePasswordMutation',
                'changeAvatar' => 'App\GraphQL\Mutation\ChangeAvatarMutation',
                'startProgram' => 'App\GraphQL\Mutation\StartProgramMutation',
                'startTask' => 'App\GraphQL\Mutation\StartTaskMutation',
                'readTask' => 'App\GraphQL\Mutation\ReadTaskMutation',
                'readLesson' => 'App\GraphQL\Mutation\ReadLessonMutation',
                'readModule' => 'App\GraphQL\Mutation\ReadModuleMutation',
                'sendMessage' => 'App\GraphQL\Mutation\SendMessageMutation',
                'sendTestResult' => 'App\GraphQL\Mutation\SendTestResultMutation',
                'resetTestResult' => 'App\GraphQL\Mutation\ResetTestResultMutation',
                'updateTestResult' => 'App\GraphQL\Mutation\UpdateTestResultMutation',
                'updateTaskStatus' => 'App\GraphQL\Mutation\UpdateTaskStatusMutation',
                'deleteNotification' => 'App\GraphQL\Mutation\DeleteNotificationMutation',
            ]
        ],
    ],

    /*
     * Additional resolvers which can also be used with shorthand building of the schema
     * using \GraphQL\Utils::BuildSchema feature
     *
     * Example:
     *
     * 'resolvers' => [
     *     'default' => [
     *         'echo' => function ($root, $args, $context) {
     *              return 'Echo: ' . $args['message'];
     *          },
     *     ],
     * ],
     */
    'resolvers' => [
        'default' => [
        ],
    ],

    /*
     * Overrides the default field resolver
     * Useful to setup default loading of eager relationships
     *
     * Example:
     *
     * 'defaultFieldResolver' => function ($root, $args, $context, $info) {
     *     // take a look at the defaultFieldResolver in
     *     // https://github.com/webonyx/graphql-php/blob/master/src/Executor/Executor.php
     * },
     */
    'defaultFieldResolver' => null,

    /*
     * The types available in the application. You can access them from the
     * facade like this: GraphQL::type('user')
     *
     * Example:
     *
     * 'types' => [
     *     'user' => 'App\GraphQL\Type\UserType'
     * ]
     *
     * or without specifying a key (it will use the ->name property of your type)
     *
     * 'types' =>
     *     'App\GraphQL\Type\UserType'
     * ]
     */
    'types' => [
        'User' => 'App\GraphQL\Type\UserType',
        'Role' => 'App\GraphQL\Type\RoleType',
        'Program' => 'App\GraphQL\Type\ProgramType',
        'Module' => 'App\GraphQL\Type\ModuleType',
        'Task' => 'App\GraphQL\Type\TaskType',
        'Event' => 'App\GraphQL\Type\EventType',
        'Progress' => 'App\GraphQL\Type\ProgressType',
        'Position' => 'App\GraphQL\Type\PositionType',
        'Lesson' => 'App\GraphQL\Type\LessonType',
        'Question' => 'App\GraphQL\Type\QuestionType',
        'Message' => 'App\GraphQL\Type\MessageType',
        'Member' => 'App\GraphQL\Type\MemberType',
        'Test' => 'App\GraphQL\Type\TestType',
        'TestQuestion' => 'App\GraphQL\Type\TestQuestionType',
        'TestAnswer' => 'App\GraphQL\Type\TestAnswerType',
        'TestResult' => 'App\GraphQL\Type\TestResultType',
        'TestResultReportItem' => 'App\GraphQL\Type\TestResultReportItemType',
        'Status' => 'App\GraphQL\Type\StatusType',
        'Notification' => 'App\GraphQL\Type\NotificationType',
    ],

    /*
     * This callable will receive all the Exception objects that are caught by GraphQL.
     * The method should return an array representing the error.
     *
     * Typically:
     *
     * [
     *     'message' => '',
     *     'locations' => []
     * ]
     */
    'error_formatter' => [\Folklore\GraphQL\GraphQL::class, 'formatError'],

    /*
     * Options to limit the query complexity and depth. See the doc
     * @ https://github.com/webonyx/graphql-php#security
     * for details. Disabled by default.
     */
    'security' => [
        'query_max_complexity' => null,
        'query_max_depth' => null,
        'disable_introspection' => false
    ]
];
