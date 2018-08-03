<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Program;

class CheckProgramAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (! $user = $request->user()) {
            return response()->json('Пользователь не авторизован', 401);
        }

        if (empty($request->program) || ! $program = Program::find($request->program)) {
            return response()->json('Не найдена программа', 400);
        }

        if (! $program->userHasAccess($user->id)) {
            return response()->json('Доступ запрещен', 403);
        }

        return $next($request);
    }
}