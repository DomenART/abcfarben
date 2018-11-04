<?php

namespace App\Admin\Controllers;

use App\Models\User;
use App\Models\Position;
use Encore\Admin\Auth\Database\Permission;
use Encore\Admin\Auth\Database\Role;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Controllers\UserController as EncoreUserController;

class UserController extends EncoreUserController
{
    public function grid()
    {
        return User::grid(function (Grid $grid) {
            $grid->id('ID')->sortable();
            $grid->email('E-mail')->sortable();
            $grid->firstname('Имя')->sortable();
            $grid->secondname('Фамилия')->sortable();
            $grid->subdivision('Подразделение')->sortable();
            $grid->sphere('Сфера')->sortable();
            $grid->city('Город')->sortable();
            $grid->country('Страна')->sortable();
            $grid->roles(trans('admin.roles'))->pluck('name')->label();
            $grid->positions('Должности')->pluck('name')->label();
            $grid->filter(function (Grid\Filter $filter) {
                $filter->like('firstname', 'Имя');
                $filter->like('secondname', 'Фамилия');
                $filter->like('email', 'E-mail');
                $filter->like('phone', 'Телефон');
                $filter->like('skype', 'Skype');
                $filter->like('subdivision', 'Подразделение');
                $filter->like('sphere', 'Сфера');
                $filter->like('city', 'Город');
                $filter->like('country', 'Страна');
                $filter->where(function ($query) {
                    $query->whereHas('positions', function ($query) {
                        $query->where('positions.id', $this->input);
                    });
                }, 'Должность')->multipleSelect(Position::all()->pluck('name', 'id'));
            });
            $grid->actions(function (Grid\Displayers\Actions $actions) {
                if ($actions->getKey() == 1) {
                    $actions->disableDelete();
                }

                $actions->disableView();
            });
            $grid->tools(function (Grid\Tools $tools) {
                $tools->batch(function (Grid\Tools\BatchActions $actions) {
                    $actions->disableDelete();
                });
            });
        });
    }

    public function form()
    {
        return User::form(function (Form $form) {
            $form->display('id', 'ID');
            $form->text('firstname', 'Имя')->rules('required');
            $form->text('secondname', 'Фамилия');
            $form->text('email', trans('admin.email'))->rules('required');
            $form->switch('email_public', 'E-mail виден всем')->states([
                'да' => ['value' => 1, 'text' => 'enable', 'color' => 'success'],
                'нет' => ['value' => 0, 'text' => 'disable', 'color' => 'danger'],
            ]);
            $form->text('phone', 'Телефон');
            $form->switch('phone_public', 'Телефон виден всем')->states([
                'да' => ['value' => 1, 'text' => 'enable', 'color' => 'success'],
                'нет' => ['value' => 0, 'text' => 'disable', 'color' => 'danger'],
            ]);
            $form->text('skype', 'Skype');
            $form->switch('skype_public', 'Skype виден всем')->states([
                'да' => ['value' => 1, 'text' => 'enable', 'color' => 'success'],
                'нет' => ['value' => 0, 'text' => 'disable', 'color' => 'danger'],
            ]);
            $form->image('avatar', trans('admin.avatar'))->fit(200);
            $form->password('password', trans('admin.password'))->rules('confirmed');
            $form->password('password_confirmation', trans('admin.password_confirmation'))
                ->rules('required')
                ->default(function ($form) {
                    return $form->model()->password;
                });
            $form->ignore(['password_confirmation']);

            $form->text('subdivision', 'Подразделение');
            $form->text('sphere', 'Сфера');
            $form->text('city', 'Город');
            $form->text('country', 'Страна');
            $form->text('about', 'О себе');

            $form->multipleSelect('positions', 'Должности')->options(Position::all()->pluck('name', 'id'));
            $form->multipleSelect('roles', trans('admin.roles'))->options(Role::all()->pluck('name', 'id'));
            $form->multipleSelect('permissions', trans('admin.permissions'))->options(Permission::all()->pluck('name', 'id'));

            $form->display('created_at', trans('admin.created_at'));
            $form->display('updated_at', trans('admin.updated_at'));

            $form->saving(function (Form $form) {
                if ($form->password && $form->model()->password != $form->password) {
                    $form->password = bcrypt($form->password);
                }
            });

            $form->tools(function (Form\Tools $tools) {
                $tools->disableView();
            });
            $form->footer(function ($footer) {
                $footer->disableViewCheck();
            });
        });
    }
}