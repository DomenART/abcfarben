<?php

namespace App\Admin\Controllers;

use App\Models\Program;
use App\Models\ProgramStatus;
use App\Models\User;
use App\Http\Controllers\Controller;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;

class ProgramStatusController extends Controller
{
    use ModelForm;

    /**
     * @var \App\Models\ProgramStatus
     */
    private $status;

    /**
     * Index interface.
     *
     * @return Content
     */
    public function index()
    {
        return Admin::content(function (Content $content) {
            $content->header('Статусы');
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
        $this->status = ProgramStatus::find($id);

        return Admin::content(function (Content $content) use ($id) {
            $content->header('Статусы');
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
            $content->header('Статусы');
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
        return Admin::grid(ProgramStatus::class, function (Grid $grid) {

            if (request('trashed') == 1) {
                $grid->model()->onlyTrashed();
            }

            $grid->id('ID')->sortable();

            $grid->program_id('Программа')->display(function ($id) {
                $program = Program::find($id);
                return "<a href='/admin/programs/{$program->id}/edit'>{$program->name}</a>";
            });

            $grid->user_id('Пользователь')->display(function ($id) {
                $user = User::find($id);
                return "<a href='/admin/auth/users/{$user->id}/edit'>{$user->name}</a>";
            });

            $grid->curator('Куратор')->display(function ($id) {
                $user = User::find($id);
                return "<a href='/admin/auth/users/{$user->id}/edit'>{$user->name}</a>";
            });

            $grid->status('Статус')->display(function ($status) {
                switch ($status) {
                    case 0: return '<span class="label label-success">Не начат</span>';
                    case 1: return '<span class="label label-success">В работе</span>';
                    case 2: return '<span class="label label-success">Закончен</span>';
                }
                return '';
            });

            $grid->actions(function ($actions) {
                $actions->disableDelete();
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
        return Admin::form(ProgramStatus::class, function (Form $form) use ($exists) {
            $curators = User::whereHas('roles', function ($query) {
                $query->where('admin_roles.slug', 'curator');
            })->get()->pluck('name', 'id');

            $form->hidden('id', 'ID');
            $form->select('status', 'Статус')->options([
                0 => 'Не начат',
                1 => 'В работе',
                2 => 'Закончен'
            ]);
            $form->select('curator', 'Куратор')->options($curators);
            $user = $form->select('user.firstname', 'Пользователь')->options(
                User::all()->pluck('name', 'id')
            );
            $program = $form->select('program.name', 'Программа')->options(
                Program::all()->pluck('name', 'id')
            );
            if ($exists) {
                $user->readOnly();
                $program->readOnly();
            }
        });
    }

}
