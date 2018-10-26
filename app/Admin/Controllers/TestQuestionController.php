<?php

namespace App\Admin\Controllers;

use App\Models\Task;
use App\Models\Test;
use App\Models\TestQuestion;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;
use Exception;

class TestQuestionController extends Controller
{

    public function index(Request $request)
    {
        $request->validate([
            'test_id' => 'required|integer'
        ]);

        try {
            $test = Test::find($request->test_id);
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Not Found'
            ], 404);
        }

        return $test->questions()->order()->get()->map(function($question) {
            return [
                'id' => $question->id,
                'title' => $question->title,
                'answers' => $question->answers()->order()->get()->map(function ($answer) {
                    return [
                        'id' => $answer->id,
                        'title' => $answer->title,
                        'correct' => $answer->correct
                    ];
                })
            ];
        });
    }

    public function store(Request $request)
    {
        $request->validate([
            'test_id' => 'required|integer',
            'title' => 'required'
        ]);

        try {
            $test = Test::find($request->test_id);
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Not Found'
            ], 404);
        }

        try {
            $question = $test->questions()->create($request->all());
        }
        catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error'
            ], 400);
        }

        return $question;
    }

    public function destroy(Request $request, TestQuestion $question)
    {
        try {
            $question->delete();

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
                if ($question = TestQuestion::find($row['id'])) {
                    $question->order = $row['order'];
                    $question->save();
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
}
