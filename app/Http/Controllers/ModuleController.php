<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Http\Resources\ModuleSpecified;

class ModuleController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param Program $program
     * @param integer $id
     *
     * @return \Illuminate\Http\Response|\App\Http\Resources\ModuleSpecified
     */
    public function show(Program $program, $id)
    {
        if (!$program->ownerHasAccess()) {
            return response()->json('Доступ к программе запрещен', 403);
        }

        /**
         * @var \App\Models\Module $module
         */
        $module = $program->modules()->where('modules.id', $id)->first();

        if (!$module) {
            return response()->json('Модуль не найден', 400);
        }

        return new ModuleSpecified($module);
    }
}
