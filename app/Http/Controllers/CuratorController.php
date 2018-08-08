<?php

namespace App\Http\Controllers;

use App\Models\ProgramStatus;
use App\Models\Program;
use App\Models\Message;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CuratorController extends Controller
{
    public function getDialogs(Request $request) {
        $user_id = $request->user()->id;
        $threads = [];
        $links = ProgramStatus::where('curator', $user_id)->with(['user', 'program'])->get();

        foreach ($links as $link) {
            foreach ($link->threads as $thread) {
                $threads[$thread->id] = [
                    'thread' => $thread->id,
                    'messages' => Message::byThread($thread->id)->count(),
                    'unread' => Message::byThread($thread->id)->notOwner()->unread()->count(),
                    'program' => $link->program,
                    'user' => $link->user
                ];
            }

            foreach ($link->program->modules as $module) {
                foreach ($module->tasks as $task) {
                    foreach ($task->statuses()->user($link->user->id)->cursor() as $status) {
                        foreach ($status->threads as $thread) {
                            $threads[$thread->id] = [
                                'thread' => $thread->id,
                                'messages' => Message::byThread($thread->id)->count(),
                                'unread' => Message::byThread($thread->id)->notOwner()->unread()->count(),
                                'program' => $link->program,
                                'task' => $task,
                                'user' => $link->user
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
        $threadable = Thread::find($request->thread)->threadable;
        $threadable->status = 1;
        $threadable->save();

        return response()->json([
            'success' => true
        ], 200);
    }

    public function getStats(Request $request) {
        $user_id = $request->user()->id;
        $unreadMessages = 0;
        $links = ProgramStatus::where('curator', $user_id)->with(['user', 'program'])->get();

        foreach ($links as $link) {
            foreach ($link->threads as $thread) {
                $unreadMessages += Message::byThread($thread->id)->notOwner()->unread()->count();
            }

            foreach ($link->program->modules as $module) {
                foreach ($module->tasks as $task) {
                    foreach ($task->statuses()->user($link->user->id)->cursor() as $status) {
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
