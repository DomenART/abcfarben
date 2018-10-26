<?php

namespace App\Admin\Controllers;

use App\Models\Task;
use App\Models\Test;
use App\Models\TestQuestion;
use App\Models\TestAnswer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;
use Exception;

class TestAnswerController extends Controller
{

    public function index(Request $request)
    {
        $request->validate([
            'question_id' => 'required|integer'
        ]);

        try {
            $question = TestQuestion::find($request->question_id);
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Not Found'
            ], 404);
        }

        return $question->answers()->order()->get()->map(function($answer) {
            return [
                'id' => $answer->id,
                'title' => $answer->title,
                'correct' => $answer->correct
            ];
        });
    }

    public function store(Request $request)
    {
        $request->validate([
            'question_id' => 'required|integer',
            'title' => 'required'
        ]);

        try {
            $question = TestQuestion::find($request->question_id);
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Not Found'
            ], 404);
        }

        try {
            $answer = $question->answers()->create($request->all());
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error'
            ], 400);
        }

        return $answer;
    }

    public function destroy(Request $request, TestAnswer $answer)
    {
        try {
            $answer->delete();

            return response()->json([
                'success' => true
            ], 200);
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error'
            ], 400);
        }
    }

    public function order(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*.id' => 'required|integer',
            'order.*.order' => 'required|integer',
        ]);

        try {
            foreach ($request->order as $row) {
                if ($answer = TestAnswer::find($row['id'])) {
                    $answer->order = $row['order'];
                    $answer->save();
                }
            }

            return response()->json([
                'success' => true
            ], 200);
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error'
            ], 400);
        }
    }

    public function update(Request $request, TestAnswer $answer)
    {
        try {
            $answer->fill($request->all());
            $answer->save();

            return $answer;
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error'
            ], 400);
        }
    }
}
