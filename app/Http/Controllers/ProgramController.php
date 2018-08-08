<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ProgramStatus;
use App\Http\Resources\ProgramListing;
use App\Http\Resources\ProgramSpecified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProgramController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return ProgramListing::collection(Program::all());
    }

    /**
     * Display the specified resource.
     *
     * @param integer $id
     *
     * @return \App\Http\Resources\ProgramSpecified|\Illuminate\Http\Response
     */
    public function show($id)
    {
        /**
         * @var Program $program
         */
        $program = Program::find($id);

        if (!$program) {
            return response()->json('Программа не найдена', 400);
        }

        $response = [
            'data' => new ProgramSpecified($program)
        ];

        if ($program->userHasAccess(request()->user()->id)) {
            $program->starting();

            $response['progress'] = $program->getProgress();

            if ($status = $program->statuses()->owner()->first()) {
                $response['curator'] = $status->curator;

                if (!$thread = $status->threads()->first()) {
                    $thread = $status->threads()->create();
                }

                $response['thread'] = $thread->id;
            }
        }

        return response()->json($response, 200);
    }

    /**
     * @param Program $program
     *
     * @return \Illuminate\Http\Response
     */
    public function tree(Program $program)
    {
        return response()->json($program->getModules(), 200);
    }

    /**
     * @param Program $program
     * @param Request $request
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getMembers(Program $program, Request $request) {
        $response = [];

        $query = $program->statuses()->with('user');

        if ($search = $request->search) {
            $query->join('users', 'users.id', '=', 'program_has_statuses.user_id')
                ->where(function ($query) use ($search) {
                    $query->where('users.firstname', 'like', '%' . $search . '%')
                        ->orWhere('users.secondname', 'like', '%' . $search . '%')
                        ->orWhere('users.email', 'like', '%' . $search . '%');
                });
        }

        foreach ($query->cursor() as $row) {
            $response[] = [
                'id' => $row->user->id,
                'name' => $row->user->name,
                'avatar' => $row->user->avatar,
                'country' => $row->user->country,
                'city' => $row->user->city,
                'sphere' => $row->user->sphere,
                'subdivision' => $row->user->subdivision,
                'positions' => $row->user->positions->pluck('name'),
                'progress' => $program->getProgress($row->user->id)
            ];
        }

        return response()->json($response, 200);
    }

    /**
     * @param Program $program
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getQuestions(Program $program) {
        return response()->json($program->questions()->get(), 200);
    }
}
