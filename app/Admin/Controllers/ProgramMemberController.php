<?php

namespace App\Admin\Controllers;

use App\Models\Program;
use App\Models\Status;
use App\Models\ProgramMember;
use App\Models\User;
use App\Http\Controllers\Controller;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;

class ProgramMemberController extends Controller
{
    use ModelForm;

    /**
     * Index interface.
     *
     * @return Content
     */
    public function index()
    {
        return Admin::content(function (Content $content) {
            $content->header('Участники');
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
        return Admin::content(function (Content $content) use ($id) {
            $content->header('Участники');
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
        return Admin::grid(ProgramMember::class, function (Grid $grid) {

            if (request('trashed') == 1) {
                $grid->model()->onlyTrashed();
            }

            $grid->id('ID')->sortable();

            $grid->program_id('Программа')->display(function ($id) {
                $program = Program::find($id);
                return "<a href='/admin/programs/{$program->id}/edit'>{$program->name}</a>";
            });

            $grid->student_id('Пользователь')->display(function ($id) {
                $user = User::find($id);
                return "<a href='/admin/auth/users/{$user->id}/edit'>{$user->name}</a>";
            });

            $grid->curator_id('Куратор')->display(function ($id) {
                $user = User::find($id);
                return "<a href='/admin/auth/users/{$user->id}/edit'>{$user->name}</a>";
            });

            $grid->column('status')->display(function () {
                $program = Program::find($this->program_id);
                if ($status = $program->statuses()->user($this->student_id)->latest()->first()) {
                    switch ($status->getLabel()) {
                        case 'primary': return  '<span class="label label-primary">Не начат</span>'; break;
                        case 'success': return  '<span class="label label-success">Закончен</span>'; break;
                        case 'warning': return  '<span class="label label-warning">В работе</span>'; break;
                        case 'danger': return  '<span class="label label-danger">Возвращен</span>'; break;
                        default: return  '<span class="label label-primary">Не начат</span>';
                    }
                }
                return '<span class="label label-primary">Не начат</span>';
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
        return Admin::form(ProgramMember::class, function (Form $form) use ($exists) {
            $curators = User::whereHas('roles', function ($query) {
                $query->where('admin_roles.slug', 'curator');
            })->get()->pluck('name', 'id');
            $students = User::all()->pluck('name', 'id');
            $programs = Program::all()->pluck('name', 'id');

            $form->hidden('id', 'ID');
            $form->select('curator_id', 'Куратор')->options($curators);
            $user = $form->select('student_id', 'Пользователь')->options($students);
            $program = $form->select('program_id', 'Программа')->options($programs);
            if ($exists) {
                $user->readOnly();
                $program->readOnly();
            }

            $form->tools(function (Form\Tools $tools) {
                $tools->disableView();
            });
            $form->footer(function ($footer) {
                $footer->disableViewCheck();
            });
        });
    }
}