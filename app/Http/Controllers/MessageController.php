<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use App\Http\Resources\MessageSpecified;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $request->validate([
            'thread' => 'required|integer'
        ]);

        Message::byThread($request->thread)->notOwner()->update(['read' => true]);

        return MessageSpecified::collection(Message::byThread($request->thread)->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \App\Http\Resources\MessageSpecified
     */
    public function store(Request $request)
    {
        $request->validate([
            'thread' => 'required|integer',
            'message' => 'required'
        ]);

        $message = Message::create([
            'thread_id' => $request->thread,
            'user_id' => $request->user()->id,
            'body' => $request->message,
        ]);

        if ($request->has('attachments')) {
            $id = $message->id;
            $message->files = collect($request->attachments)->map(function($file) use ($id) {
                return $file->storeAs('messages/' . $id, $file->getClientOriginalName(), 'public');
            });
            $message->save();
        }

        return new MessageSpecified($message);
    }
}
