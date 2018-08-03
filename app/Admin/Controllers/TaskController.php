<?php

namespace App\Admin\Controllers;

use App\Admin\Extensions\LessonsTree;
use App\Models\Module;
use App\Models\Task;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;
use Exception;

class TaskController extends Controller
{
    use ModelForm;

    /**
     * @var \App\Models\Task
     */
    private $task;

    /**
     * Index interface.
     *
     * @return Content
     */
    public function index()
    {
        return Admin::content(function (Content $content) {
            $content->header('Задания');
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
        $this->task = Task::find($id);

        return Admin::content(function (Content $content) use ($id) {
            $content->header('Задания');
            $form = $this->form();
            $form->tab('Уроки', function ($form) {
                $form->html($this->lessons());
            });
            $form->edit($id);
            $form->tools(function (Form\Tools $tools) use ($form) {
                $tools->disableListButton();
                $tools->add('<div class="btn-group pull-right"><a href="/admin/modules/' . $form->model->module_id . '#tab-form-2" class="btn btn-sm btn-info">Перейти к модулю</a></div>');
            });
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
            $content->header('Задания');
            $form = $this->form();
            $form->tools(function (Form\Tools $tools) {
                $tools->disableListButton();
                if (request()->has('module_id')) {
                    $tools->add('<div class="btn-group pull-right"><a href="/admin/modules/' . request()->input('module_id') . '#tab-form-2" class="btn btn-sm btn-info">Перейти к модулю</a></div>');
                }
            });
            $content->body($form);
        });
    }

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        return Admin::grid(Task::class, function (Grid $grid) {

            if (request('trashed') == 1) {
                $grid->model()->onlyTrashed();
            }

            $grid->id('ID')->sortable();
            $grid->name('Название')->sortable();
            $grid->module('Модуль')->display(function ($module) {
                return '<a href="/admin/modules/' . $module['id'] . '" class="label label-success">' . $module['name'] . '</a>';
            });
            $grid->created_at('Дата создания');
            $grid->filter(function (Grid\Filter $filter) {
                $filter->like('name');
                $filter->where(function ($query) {
                    $query->whereHas('module', function ($query) {
                        $query->where('modules.id', $this->input);
                    });
                }, 'Модуль')->select('/' . config('admin.route.prefix') . '/api/modules/filter/list');
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
        return Admin::form(Task::class, function (Form $form) {
            $form->tab('Параметры', function ($form) {
                $form->hidden('id');
                $form->text('name', 'Название');
                $form->switch('solo', 'Без куратора')->states([
                    'да' => ['value' => 1, 'text' => 'enable', 'color' => 'success'],
                    'нет' => ['value' => 0, 'text' => 'disable', 'color' => 'danger'],
                ]);
                $form->editor('content', 'Содержимое');
                $select = $form->select('module_id', 'Модуль')->options(function ($id) {
                    $module = Module::find($id);

                    return $module ? [$module->id => $module->name] : null;
                });
                if (request()->has('module_id')) {
                    $select->value(request()->input('module_id'));
                }
                $select->ajax('/admin/api/modules/list');

                $form->multipleFile('files', 'Файлы');
            });
        });
    }

    public function lessons()
    {
        $tree = new LessonsTree($this->task);

        return $tree;
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function list(Request $request)
    {
        $search = $request->input($request->has('query') ? 'query' : 'q');
        $select = ['id', 'name as text'];

        $query = Task::query();

        if (!empty($search)) {
            $query->where('name', 'like', "%$search%");
        }

        return $query->paginate(10, $select);
    }

    /**
     * @param Request $request
     */
    public function sort(Request $request)
    {
        Task::saveOrder(json_decode($request->input('_order')));
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

        $query = Task::query();

        if (!empty($search)) {
            $query->where('name', 'like', "%$search%");
        }

        return $query->select($select)->get();
    }
}
