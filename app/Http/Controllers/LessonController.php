<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Lesson;
use App\Http\Resources\LessonSpecified;
use App\Http\Resources\LessonLimited;

class LessonController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param Program $program
     * @param integer $id
     *
     * @return \Illuminate\Http\Response|\App\Http\Resources\LessonSpecified
     */
    public function show(Program $program, $id)
    {
        if (!$program->ownerHasAccess()) {
            return response()->json([
                'error' => 'Доступ к программе запрещен'
            ], 403);
        }

        if (!$lesson = Lesson::find($id)) {
            return response()->json([
                'error' => 'Урок не найден'
            ], 404);
        }

        if (!$program->isContainsLesson($lesson)) {
            return response()->json([
                'error' => 'Урок не принадлежит программе'
            ], 400);
        }

        if (!$lesson->task->module->isOpenedByPrevious($program)) {
            return response()->json([
                'error' => 'Выполните задания предыдущего модуля',
                'data' => new LessonLimited($lesson),
            ], 403);
        }

        if (!$lesson->statuses()->owner()->first()) {
            $lesson->statuses()->create([
                'user_id' => request()->user()->id,
                'status' => 2
            ]);
        }

        $previous = $lesson->getPrevious();
        $next = $lesson->getNext();

        return response()->json([
            'data' => new LessonSpecified($lesson),
            'previous' => $previous ? new LessonSpecified($previous) : null,
            'next' => $next ? new LessonSpecified($next) : null,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param Program $program
     * @param Lesson $lesson
     *
     * @return \Illuminate\Http\Response
     */
    public function read(Program $program, Lesson $lesson) {
        if (!$program->ownerHasAccess()) {
            return response()->json([
                'error' => 'Доступ к программе запрещен'
            ], 403);
        }

        if (!$lesson->task->module->isOpenedByPrevious($program)) {
            return response()->json([
                'error' => 'Выполните задачи предыдущего модуля'
            ], 403);
        }

        if (!$lesson->ownerStatus) {
            $lesson->statuses()->create([
                'user_id' => request()->user()->id,
                'status' => 1
            ]);
        } else {
            $lesson->ownerStatus->status = 1;
            $lesson->ownerStatus->save();
        }

        return response()->json('success', 200);
    }
}
