<?php

namespace App\Admin\Controllers;

// use App\Admin\Extensions\ExcelExporter;
// use App\Admin\Extensions\Tools\ReleasePost;
// use App\Admin\Extensions\Tools\RestorePost;
// use App\Admin\Extensions\Tools\ShowSelected;
// use App\Admin\Extensions\Tools\Trashed;
use App\Models\Position;
// use App\Models\Tag;
// use App\Models\User;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use App\Http\Controllers\Controller;
use Encore\Admin\Controllers\ModelForm;
use Illuminate\Http\Request;

class PositionController extends Controller
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
            $content->header('Должности');
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
            $content->header('Должности');
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
            $content->header('Должности');
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
        return Admin::grid(Position::class, function (Grid $grid) {

            if (request('trashed') == 1) {
                $grid->model()->onlyTrashed();
            }

            $grid->id('ID')->sortable();

            $grid->name()->sortable();
            $grid->created_at();

            $grid->filter(function (Grid\Filter $filter) {
                $filter->like('name');
            });

            $grid->actions(function ($actions) {
                $actions->disableView();
            });
        });
    }

    protected function _form()
    {
        return Admin::form(Position::class, function (Form $form) {

            $form->row(function ($row) {
                $row->width(2)->display('id', 'ID');
            });

            $form->row(function ($row) {
                $row->width(4)->text('name', 'Название')->rules('min:3')->help('Название help');
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
        return Admin::form(Position::class, function (Form $form) {
            $form->display('id', 'ID');
            $form->text('name')->default('');

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
     * @return mixed
     */
    public function users(Request $request)
    {
        $q = $request->get('q');

        return User::where('name', 'like', "%$q%")->paginate(null, ['id', 'name as text']);
    }

    public function release(Request $request)
    {
        foreach (Position::find($request->get('ids')) as $post) {
            $post->released = $request->get('action');
            $post->save();
        }
    }

    public function restore(Request $request)
    {
        return Position::onlyTrashed()->find($request->get('ids'))->each->restore();
    }
}
