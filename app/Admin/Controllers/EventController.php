<?php

namespace App\Admin\Controllers;

use App\Models\Event;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Encore\Admin\Controllers\ModelForm;
use Exception;

class EventController extends Controller
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
            $content->header('События');
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
            $content->header('События');
            $form = $this->form();
            $form->edit($id);
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
            $content->header('События');
            $form = $this->form();
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
        return Admin::grid(Event::class, function (Grid $grid) {
            if (request('trashed') == 1) {
                $grid->model()->onlyTrashed();
            }

            $grid->id('ID')->sortable();
            $grid->title('Заголовок')->sortable();
            $grid->created_at('Дата создания');

            $grid->filter(function (Grid\Filter $filter) {
                $filter->like('title');
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
        return Admin::form(Event::class, function (Form $form) {
            $form->hidden('id');
            $form->text('title', 'Заголовок');
            $form->text('annotation', 'Аннотация');
            $form->editor('content', 'Содержимое');
            $form->date('created_at', 'Дата создания');

            $form->tools(function (Form\Tools $tools) {
                $tools->disableView();
            });
            $form->footer(function ($footer) {
                $footer->disableViewCheck();
            });
        });
    }
}
