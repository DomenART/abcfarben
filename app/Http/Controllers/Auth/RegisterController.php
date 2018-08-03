<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Mockery\Exception;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validator =  Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $request->merge(['password' => Hash::make($request->password)]);

        try {
            User::create($request->all());
            return response()->json(['success', true], 200);
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Невозможно зарегистрировать пользователя'
            ], 400);
        }
    }
}
