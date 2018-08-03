<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Resources\UserSpecified;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // grab credentials from the request
        $credentials = $request->only('email', 'password');
        $remember = $request->input('remember') ? $request->input('remember') : false;
        if (Auth::attempt($credentials, $request->input('remember'))) {
            $user = Auth::user();
            $token = $user->createToken('web')->accessToken;
            return response()->json([
                'user'  => new UserSpecified($user),
                'token' => $token
            ], 200);
        } else {
            return response()->json([
                'errors' => [
                    'email' => ['Не правильный e-mail или пароль']
                ]
            ], 401);
        }
    }
}
