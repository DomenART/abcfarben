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

    public function tree(Program $program)
    {
        return response()->json($program->getModules(), 200);
    }
}
