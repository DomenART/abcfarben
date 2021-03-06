<?php

namespace App\Admin\Controllers;

use App\Models\Program;
use App\Models\ProgramModule;
use App\Models\Position;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Admin\Extensions\ModulesTree;
use Illuminate\Http\Request;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;

class ProgramController extends Controller
{
    use ModelForm;

    /**
     * @var \App\Models\Program
     */
    private $program;

    /**
     * Index interface.
     *
     * @return Content
     */
    public function index()
    {
        return Admin::content(function (Content $content) {
            $content->header('Программы');
            $content->body($this->grid());
        });
    }

    /**
     * Edit interface.
     *
     * @param integer $id
     * @return Content
     */
    public function edit($id)
    {
        $this->program = Program::find($id);

        return Admin::content(function (Content $content) use ($id) {
            $content->header('Программы');
            $content->body($this->form()->edit($id));
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
            $content->header('Программы');
            $content->body($this->form(false));
        });
    }

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        return Admin::grid(Program::class, function (Grid $grid) {

            if (request('trashed') == 1) {
                $grid->model()->onlyTrashed();
            }

            $grid->id('ID')->sortable();
            $grid->name('Имя')->sortable();
            $grid->created_at('Дата создания');
            $grid->filter(function (Grid\Filter $filter) {
                $filter->like('name');
            });

            $grid->actions(function ($actions) {
                $actions->disableView();
            });
        });
    }

    /**
     * Make a form builder.
     *
     * @param boolean $exists
     *
     * @return Form
     */
    protected function form($exists = true)
    {
        return Admin::form(Program::class, function (Form $form) use ($exists) {
            $form->tab('Параметры', function ($form) use ($exists) {
                $form->hidden('id', 'ID');
                $form->text('name');
                $form->editor('content', 'Содержимое');
                $form->textarea('annotation', 'Аннотация')->rows(2);
                $form->image('image', 'Изображение');
                $form->slider('passing_time', 'Время на прохождение')
                    ->help('0 - без ограничений по времени')
                    ->options(['max' => 365, 'min' => 0, 'step' => 1]);
            });

            $form->tab('Куратор', function ($form) use ($exists) {
                $curators = User::whereHas('roles', function ($query) {
                    $query->where('admin_roles.slug', 'curator');
                })->get()->pluck('name', 'id');

                $form->select('curator_id', 'Куратор по умолчанию')->options($curators);
                $form->text('curator_dialog_title', 'Заголовок переписки с куратором');
                $form->editor('curator_dialog_content', 'Описание переписки с куратором');
            });

            $form->tab('Эксперт', function ($form) use ($exists) {
                $experts = User::whereHas('roles', function ($query) {
                    $query->where('admin_roles.slug', 'expert');
                })->get()->pluck('name', 'id');

                $form->select('expert_id', 'Эксперт по умолчанию')->options($experts);
                $form->text('expert_dialog_title', 'Заголовок переписки с экспертом');
                $form->editor('expert_dialog_content', 'Описание переписки с экспертом');
            });

            if ($exists) {
                $form->tab('Доступы', function ($form) {

                    $form->switch('public', 'Общедоступная')->states([
                        'да' => ['value' => 1, 'text' => 'enable', 'color' => 'success'],
                        'нет' => ['value' => 0, 'text' => 'disable', 'color' => 'danger'],
                    ]);

                    $form->listbox('users', 'Пользователи')
                        ->options(User::all()->pluck('name', 'id'))
                        ->settings(['selectorMinimalHeight' => 300]);

                    $form->listbox('positions', 'Должности')
                        ->options(Position::all()->pluck('name', 'id'))
                        ->settings(['selectorMinimalHeight' => 300]);

                });

                $form->tab('Модули', function ($form) {

                    $form->html($this->modules());

                });
            }

            $form->tools(function (Form\Tools $tools) {
                $tools->disableView();
            });
            $form->footer(function ($footer) {
                $footer->disableViewCheck();
            });
        });
    }

    public function modules() {
        $tree = new ModulesTree($this->program);

        return $tree;
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

        $query = Program::query();

        if (!empty($search)) {
            $query->where('name', 'like', "%$search%");
        }

        return $query->select($select)->get();
    }
}
