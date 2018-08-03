<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Program;
use App\Http\Resources\TaskSpecified;
use App\Http\Resources\TaskLimited;

class TaskController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param Program $program
     * @param integer $id
     *
     * @return \Illuminate\Http\Response|TaskSpecified
     */
    public function show(Program $program, $id)
    {
        if (!$program->ownerHasAccess()) {
            return response()->json([
                'error' => 'Доступ к программе запрещен'
            ], 403);
        }

        if (!$task = Task::find($id)) {
            return response()->json([
                'error' => 'Задание не найдено'
            ], 404);
        }

        if (!$program->isContainsTask($task)) {
            return response()->json([
                'error' => 'Задание не принадлежит программе'
            ], 400);
        }

        if (!$task->module->isOpenedByPrevious($program)) {
            return response()->json([
                'error' => 'Выполните задания предыдущего модуля',
                'data' => new TaskLimited($task),
            ], 403);
        }

        if (!$status = $task->statuses()->owner()->first()) {
            $status = $task->statuses()->create([
                'user_id' => request()->user()->id,
                'status' => 2
            ]);
        }

        if (!$thread = $status->threads()->first()) {
            $thread = $status->threads()->create();
        }

        return response()->json([
            'data' => new TaskSpecified($task),
            'thread' => $thread->id,
            'firstLesson' => $task->getFirstLesson(),
            'nextLesson' => $task->getNextLesson(),
        ], 200);
    }

    public function read(Program $program, Task $task) {
        if (!$program->ownerHasAccess()) {
            return response()->json([
                'error' => 'Доступ к программе запрещен'
            ], 403);
        }

        if (!$task->module->isOpenedByPrevious($program)) {
            return response()->json([
                'error' => 'Выполните задачи предыдущего модуля'
            ], 403);
        }

        if (!$task->solo) {
            return response()->json([
                'error' => 'Задание должен принять куратор'
            ], 403);
        }

        if (!$status = $task->statuses()->owner()->first()) {
            $task->statuses()->create([
                'user_id' => request()->user()->id,
                'status' => 1
            ]);
        } else {
            $status->status = 1;
            $status->save();
        }

        return response()->json([
            'data' => new TaskSpecified($task)
        ], 200);
    }
}
