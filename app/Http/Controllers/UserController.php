<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserSpecified;
use Intervention\Image\Facades\Image;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return User::with('positions')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // $validator =  Validator::make($request->all(), [
        //     'name' => 'required|string|max:255',
        //     'email' => 'required|string|email|max:255|unique:users',
        //     'password' => 'required|string|min:6|confirmed',
        // ]);

        // if ($validator->fails()) {
        //     return response()->json([
        //         'errors' => $validator->errors()
        //     ], 422);
        // }

        // $request->merge(['password' => Hash::make($request->password)]);

        // try {
        //     $data = User::create($request->all());
        //     return response()->json($data, 200);
        // }
        // catch (Exception $e) {
        //     return response()->json($e->getMessage(), 400);
        // }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $user = User::find($id);

            return response()->json([
                'data' => new UserSpecified($user),
                'owner' => $user->isOwner()
            ], 200);
        }
        catch (Exception $e) {
            return response()->json($e->getMessage(), 400);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'email' => 'required|email',
            'firstname' => 'required'
        ]);

        $data= $request->all();
        $data['email_public'] = !empty($data['email_public']) ? true : false;
        $data['phone_public'] = !empty($data['phone_public']) ? true : false;
        $data['skype_public'] = !empty($data['skype_public']) ? true : false;

        try {
            $user = User::find($id);
            $user->fill($data);
            $user->save();
            return new UserSpecified($user);
        }
        catch (Exception $e) {
            return response()->json($e->getMessage(), 400);
        }
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function putAvatar(Request $request, User $user)
    {
        $request->validate([
            'avatar' => 'required|file|image'
        ]);

        $filename = 'images/' . $request->avatar->getClientOriginalName();

        $image = Image::make($request->avatar);
        $image->fit(200);
        $image->save(storage_path('app/public/admin/' . $filename));

        $user->avatar = $filename;
        $user->save();

        return $user->avatar;
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function putPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|confirmed'
        ]);

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['success' => true], 200);
    }
}
