<?php

namespace App\Admin\Controllers;

use App\Admin\Extensions\TasksTree;
use App\Models\Module;
use App\Models\Program;
use App\Models\ProgramModule;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;
use Exception;

class ModuleController extends Controller
{
    use ModelForm;

    /**
     * @var \App\Models\Module
     */
    private $module;

    /**
     * Index interface.
     *
     * @return Content
     */
    public function index()
    {
        return Admin::content(function (Content $content) {
            $content->header('Модули');
            $content->body($this->grid());
        });
    }

    /**
     * Edit interface.
     *
     * @param $id
     * @return Content
     */
    public function edit($id)
    {
        $this->module = Module::find($id);

        return Admin::content(function (Content $content) use ($id) {
            $content->header('Модули');
            $form = $this->form();
            $form->edit($id);
            if ($id) {
                $form->tab('Задания', function ($form) {
                    $form->html($this->tasks());
                });
            }
            $content->body($form);
        });
    }

    /**
     * Create interface.
     *
     * @return Content
     */
    public function create()
    {
        return Admin::content(function (Content $content) {
            $content->header('Модули');
            $content->body($this->form());
        });
    }

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        return Admin::grid(Module::class, function (Grid $grid) {

            if (request('trashed') == 1) {
                $grid->model()->onlyTrashed();
            }

            $grid->id('ID')->sortable();
            $grid->name('Название')->sortable();
            $grid->programs('Программы')->display(function ($programs) {
                $programs = array_map(function ($program) {
                    return '<a href="/admin/programs/' . $program['id'] . '" class="label label-success">' . $program['name'] . '</a>';
                }, $programs);

                return join('&nbsp;', $programs);
            });
            $grid->created_at('Дата создания');
            $grid->filter(function (Grid\Filter $filter) {
                $pathPrograms = '/' . config('admin.route.prefix') . '/api/programs/filter/list';
                $filter->like('name');
                $filter->where(function ($query) {
                    $query->whereHas('programs', function ($query) {
                        $query->where('programs.id', $this->input);
                    });
                }, 'Программа')->select($pathPrograms);
            });

            $grid->actions(function ($actions) {
                $actions->disableView();
            });
        });
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        return Admin::form(Module::class, function (Form $form) {
            $form->tab('Параметры', function ($form) {
                $form->hidden('id');
                if (request()->has('program')) {
                    $form->hidden('program')->default(request()->input('program'));
                }
                $form->text('name', 'Имя');
                $form->editor('content', 'Содержимое');
                $form->saved(function (Form $form) {
                    if ($form->program) {
                        $maxOrder = ProgramModule::where('program_id', $form->program)->max('order');
                        ProgramModule::create([
                            'module_id' => $form->model()->id,
                            'program_id' => $form->program,
                            'order' => $maxOrder + 1
                        ]);
                    }
                });
            });

            $form->tools(function (Form\Tools $tools) {
                $tools->disableView();
            });
            $form->footer(function ($footer) {
                $footer->disableViewCheck();
            });
        });
    }

    public function tasks()
    {
        $tree = new TasksTree($this->module);

        return $tree;
    }

    /**
     * @param Request $request
     */
    public function sort(Request $request)
    {
        ProgramModule::saveOrder(json_decode($request->input('_order')));
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function list(Request $request)
    {
        $search = $request->input($request->has('query') ? 'query' : 'q');
        $program = $request->input('program');
        $select = ['id', 'name as text'];

        $query = Module::query();

        if (!empty($program)) {
            $query->withoutProgram($program);
        }

        if (!empty($search)) {
            $query->where('name', 'like', "%$search%");
        }

        return $query->paginate(10, $select);
    }

    /**
     * @param Request $request
     */
    public function bind(Request $request)
    {
        $module = $request->input('module');
        $program = $request->input('program');
        $maxOrder = ProgramModule::where('program_id', $program)->max('order');

        ProgramModule::create([
            'module_id' => $module,
            'program_id' => $program,
            'order' => $maxOrder + 1
        ]);
    }

    /**
     * @param integer $id
     *
     * @return array
     */
    public function unbind($id)
    {
        try {
            ProgramModule::destroy($id);

            return response()->json([
                'status' => true,
                'message' => 'Запись удалена'
            ], 200);
        }
        catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function filterList(Request $request)
    {
        $search = $request->input('q');
        $select = ['id', 'name as text'];

        $query = Module::query();

        if (!empty($search)) {
            $query->where('name', 'like', "%$search%");
        }

        return $query->select($select)->get();
    }
}
