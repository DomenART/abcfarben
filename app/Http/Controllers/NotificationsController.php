<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationsController extends Controller
{
    private function _getNotifications() {
        $notifications = [];

        foreach (Notification::owner()->order()->cursor() as $row) {
            $notifications[] = [
                'id' => $row->id,
                'type' => $row->type,
                'title' => $row->title,
                'group' => $row->program->name,
                'data' => $row->data,
                //'created_at' => $row->created_at
            ];
        }

        return array_values($notifications);
    }

    public function index()
    {
        return response()->json($this->_getNotifications(), 200);
    }

    public function destroy($id)
    {
        $notification = Notification::find($id);
        $notification->delete();

        return response()->json($this->_getNotifications(), 200);
    }
}
