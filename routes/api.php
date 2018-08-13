<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'password'], function() {
	Route::post('/email', 'Auth\ForgotPasswordController@getResetToken');
	Route::post('/reset', 'Auth\ResetPasswordController@reset');
});

Route::group(['prefix'=> 'auth'], function() {
	Route::post('/register', 'Auth\RegisterController@register');
	Route::post('/login', 'Auth\LoginController@login');
});

Route::middleware(['auth:api'])->group(function(){
	Route::apiResource('programs', 'ProgramController')->only([
        'index', 'show'
    ]);
    Route::apiResource('programs/{program}/modules', 'ModuleController')->only([
        'show'
    ]);
    Route::apiResource('programs/{program}/tasks', 'TaskController')->only([
        'show'
    ]);
    Route::apiResource('programs/{program}/lessons', 'LessonController')->only([
        'show'
    ]);
    Route::apiResource('events', 'EventController')->only([
        'index'
    ]);
    Route::get('programs/{program}/tree', 'ProgramController@tree');
    Route::get('programs/{program}/members', 'ProgramController@getMembers');
    Route::get('programs/{program}/questions', 'ProgramController@getQuestions');
    Route::post('programs/{program}/lessons/{lesson}/read', 'LessonController@read');
    Route::post('programs/{program}/tasks/{task}/read', 'TaskController@read');
    Route::apiResource('messages', 'MessageController');
    Route::apiResource('users', 'UserController');
    Route::put('users/{user}/avatar', 'UserController@putAvatar');
    Route::put('users/{user}/password', 'UserController@putPassword');
    Route::get('curator/dialogs', 'CuratorController@getDialogs');
    Route::get('curator/dialogs/{thread}', 'CuratorController@getDialog');
    Route::post('curator/accept', 'CuratorController@acceptTask');
    Route::get('curator/stats', 'CuratorController@getStats');
    Route::apiResource('notifications', 'NotificationsController')->only([
        'index', 'destroy'
    ]);
//    Route::get('notifications', 'NotificationsController@getNotifications');
//    Route::delete('notifications/{notification}', 'NotificationsController@deleteNotification');

	// Route::apiResources([
	// 	'users' => 'UserController',
	// 	'positions' => 'PositionController',
	// 	'roles' => 'RoleController',
	// ]);
});

// Route::middleware(['auth:api'])->group(function(){
// 	Route::get('/hello', function(){
// 		return "Cool dude";
// 	});
// });

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
