<?php

namespace App\Admin\Controllers;

use App\Models\Question;
use App\Http\Controllers\Controller;
use App\Admin\Extensions\ModulesTree;
use Illuminate\Http\Request;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;

class WikiController extends Controller
{
    use ModelForm;

    /**
     * @var \App\Models\Question
     */
    private $question;

    /**
     * Index interface.
     *
     * @return Content
     */
    public function index()
    {
        return Admin::content(function (Content $content) {
            $content->header('Wiki');
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
        $this->question = Question::find($id);

        return Admin::content(function (Content $content) use ($id) {
            $content->header('Wiki');
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
            $content->header('Wiki');
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
        return Admin::grid(Question::class, function (Grid $grid) {

            if (request('trashed') == 1) {
                $grid->model()->onlyTrashed();
            }

            $grid->id('ID')->sortable();
            $grid->title('Название')->sortable();
            $grid->created_at('Дата создания');
            $grid->filter(function (Grid\Filter $filter) {
                $filter->like('title');
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
        return Admin::form(Question::class, function (Form $form) use ($exists) {
            $form->tab('Параметры', function ($form) use ($exists) {

                $form->hidden('id', 'ID');
                $form->text('title');
                $form->editor('content', 'Содержимое');
            });
        });
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function filterList(Request $request)
    {
        $search = $request->input('q');
        $select = ['id', 'title as text'];

        $query = Question::query();

        if (!empty($search)) {
            $query->where('title', 'like', "%$search%");
        }

        return $query->select($select)->get();
    }
}
