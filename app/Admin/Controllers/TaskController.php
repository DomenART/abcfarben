<?php

namespace App\Admin\Controllers;

use App\Admin\Extensions\LessonsTree;
use App\Models\Module;
use App\Models\Task;
use App\Models\Test;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Encore\Admin\Form;
use Encore\Admin\Form\Field\Text;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;
use Exception;
use Encore\Admin\Widgets\Box;
use function GuzzleHttp\json_encode;

class TaskController extends Controller
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
        return Admin::content(function (Content $content) use ($id) {
            $content->header('Задания');

            $form = $this->form()->edit($id);

            if ($form->model()->exists) {
                $form->tab('Уроки', function ($form) {
                    $form->html(new LessonsTree($form->model()));
                });

                if (in_array($form->model()->type, ['test'])) {
                    if ($test = $form->model()->test) {
                        $form->tab('Тест', function ($form) use ($test) {
                            $form->select('test.type', 'Тип теста')->options([
                                'fixation' => 'Закрепление материала',
                                'evaluation' => 'Оценка знаний',
                            ])->value('fixation');
                            if ($test->type === 'evaluation') {
                                $form->text('test.time', 'Время на прохождение');
                                $form->text('test.auto', 'Автоматическое прохождение');
                            }
                            $form->html("<div id='test-form-fixation' data-test_id='" . $test->id . "'></div>");
                        });
                    }
                }
            }

            $form->tools(function (Form\Tools $tools) use ($form) {
                $tools->disableListButton();
                $tools->add('<div class="btn-group pull-right"><a href="/admin/modules/' . $form->model->module_id . '/edit#tab-form-2" class="btn btn-sm btn-info">Перейти к модулю</a></div>');
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
        return Admin::form(Task::class, function (Form $form) {
            $form->saving(function (Form $form) {
                if ($form->model()->id) {
                    if ($test = $form->model()->test) {
                        if (is_array($form->test)) {
                            $test->fill($form->test);
                            $test->save();
                        }
                    }
                }
            });

            $form->saved(function (Form $form) {
                if ($form->model()->id) {
                    if ($form->model()->type === 'test') {
                        if (!$test = $form->model()->test) {
                            $test = new Test;
                            $test->task()->associate($form->model());
                            $test->save();
                        }
                    }
                }
            });

            $form->tab('Параметры', function ($form) {
                $form->hidden('id');
                $form->text('name', 'Название');
                $form->editor('content', 'Содержимое');
                $form->select('type', 'Тип')->options([
                    'default' => 'По умолчанию',
                    'independent' => 'Самостоятельное',
                    'test' => 'С тестом',
                ])->value('default');

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

            $form->tools(function (Form\Tools $tools) {
                $tools->disableView();
            });
            $form->footer(function ($footer) {
                $footer->disableViewCheck();
            });
        });
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
