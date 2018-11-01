<?php

namespace App\Http\Controllers;

use App\Models\ProgramMember;
use App\Models\Notification;
use App\Models\Message;
use App\Models\Thread;
use Illuminate\Http\Request;

class CuratorController extends Controller
{
    public function getDialogs(Request $request) {
        $user_id = $request->user()->id;
        $threads = [];
        $links = ProgramMember::where('curator_id', $user_id)->with(['student', 'program'])->get();

        foreach ($links as $link) {
            foreach ($link->threads as $thread) {
                $threads[$thread->id] = [
                    'thread' => $thread->id,
                    'messages' => Message::byThread($thread->id)->count(),
                    'unread' => Message::byThread($thread->id)->notOwner()->unread()->count(),
                    'program' => $link->program,
                    'user' => $link->student
                ];
            }

            foreach ($link->program->modules as $module) {
                foreach ($module->tasks as $task) {
                    foreach ($task->statuses()->user($link->student->id)->cursor() as $status) {
                        foreach ($status->threads as $thread) {
                            $threads[$thread->id] = [
                                'thread' => $thread->id,
                                'messages' => Message::byThread($thread->id)->count(),
                                'unread' => Message::byThread($thread->id)->notOwner()->unread()->count(),
                                'program' => $link->program,
                                'task' => $task,
                                'user' => $link->student
                            ];
                        }
                    }
                }
            }
        }

        return response()->json([
            'threads' => $threads
        ], 200);
    }

    public function getDialog(Thread $thread) {
        $response = [];

        switch ($thread->threadable_type) {
            case 'App\Models\TaskStatus':
                $response = [
                    'type' => 'task',
                    'task' => $thread->threadable->task,
                    'status' => $thread->threadable->status
                ];
                break;
            case 'App\Models\ProgramStatus':
                $response = [
                    'type' => 'program',
                    'program' => $thread->threadable->program,
                    'status' => $thread->threadable->status
                ];
                break;
        }

        return response()->json($response, 200);
    }

    public function acceptTask(Request $request) {
        $request->validate([
            'thread' => 'required|integer'
        ]);

        // TODO: проверка на наличие доступа к заданию у куратора
        $thread = Thread::find($request->thread);
        $thread->threadable->status = 1;
        $thread->threadable->save();

        Notification::create([
            'title' => 'Эксперт принял задание "' . $thread->threadable->task->name . '"',
            'user_id' => $thread->threadable->user_id,
            'program_id' => $thread->program_id,
            'type' => 'task',
            'data' => [
                'program_id' => $thread->program_id,
                'module_id' => $thread->threadable->task->module->id,
                'task_id' => $thread->threadable->task->id,
            ]
        ]);

        return response()->json([
            'success' => true
        ], 200);
    }

    public function getStats(Request $request) {
        $user_id = $request->user()->id;
        $unreadMessages = 0;
        $links = ProgramMember::where('curator_id', $user_id)->with(['student', 'program'])->get();

        foreach ($links as $link) {
            foreach ($link->threads as $thread) {
                $unreadMessages += Message::byThread($thread->id)->notOwner()->unread()->count();
            }

            foreach ($link->program->modules as $module) {
                foreach ($module->tasks as $task) {
                    foreach ($task->statuses()->user($link->student->id)->cursor() as $status) {
                        foreach ($status->threads as $thread) {
                            $unreadMessages += Message::byThread($thread->id)->notOwner()->unread()->count();
                        }
                    }
                }
            }
        }

        return response()->json([
            'unreadMessages' => $unreadMessages
        ], 200);
    }
}
