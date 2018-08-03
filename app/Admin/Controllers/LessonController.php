<?php

namespace App\Admin\Controllers;

use App\Admin\Extensions\LessonsTree;
use App\Models\Task;
use App\Models\Lesson;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;
use Exception;

class LessonController extends Controller
{
    use ModelForm;

    /**
     * @var \App\Models\Lesson
     */
    private $lesson;

    /**
     * Index interface.
     *
     * @return Content
     */
    public function index()
    {
        return Admin::content(function (Content $content) {
            $content->header('Уроки');
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
        $this->lesson = Lesson::find($id);

        return Admin::content(function (Content $content) use ($id) {
            $content->header('Уроки');
            $form = $this->form();
            $form->edit($id);
            $form->tools(function (Form\Tools $tools) use ($form) {
                $tools->disableListButton();
                $tools->add('<div class="btn-group pull-right"><a href="/admin/tasks/' . $form->model->task_id . '#tab-form-2" class="btn btn-sm btn-info">Перейти к заданию</a></div>');
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
            $content->header('Уроки');
            $form = $this->form();
            $form->tools(function (Form\Tools $tools) {
                $tools->disableListButton();
                if (request()->has('task_id')) {
                    $tools->add('<div class="btn-group pull-right"><a href="/admin/tasks/' . request()->input('task_id') . '#tab-form-2" class="btn btn-sm btn-info">Перейти к заданию</a></div>');
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
        return Admin::grid(Lesson::class, function (Grid $grid) {

            if (request('trashed') == 1) {
                $grid->model()->onlyTrashed();
            }

            $grid->id('ID')->sortable();
            $grid->name('Имя')->sortable();
            $grid->task('Задание')->display(function ($task) {
                return '<a href="/admin/tasks/' . $task['id'] . '" class="label label-success">' . $task['name'] . '</a>';
            });
            $grid->created_at('Дата создания');
            $grid->filter(function (Grid\Filter $filter) {
                $filter->like('name');
                $filter->where(function ($query) {
                    $query->whereHas('task', function ($query) {
                        $query->where('tasks.id', $this->input);
                    });
                }, 'Задание')->select('/' . config('admin.route.prefix') . '/api/tasks/filter/list');

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
        return Admin::form(Lesson::class, function (Form $form) {
            $form->tab('Параметры', function ($form) {
                $form->hidden('id');
                $form->text('name', 'Название');
                $form->editor('content', 'Содержимое');
                $select = $form->select('task_id', 'Задание')->options(function ($id) {
                    $task = Task::find($id);

                    return $task ? [$task->id => $task->name] : null;
                });
                if (request()->has('task_id')) {
                    $select->value(request()->input('task_id'));
                }
                $select->ajax('/admin/api/tasks/list');
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

        $query = Lesson::query();

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
        Lesson::saveOrder(json_decode($request->input('_order')));
    }
}
