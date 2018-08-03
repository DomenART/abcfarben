<?php

namespace App\Admin\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CKEditor5Controller extends Controller
{
    public function upload(Request $request)
    {
        try {
            $path = $request->file('upload')->store(
                'uploads', 'admin'
            );

            return response()->json([
                'uploaded' => true,
                'url' => env('APP_URL').'/storage/admin/' . $path
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'uploaded' => false,
                    'error' => [
                        'message' => $e->getMessage()
                    ]
                ]
            );
        }
    }
}
