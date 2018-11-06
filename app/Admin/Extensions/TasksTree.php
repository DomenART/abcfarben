<?php

namespace App\Admin\Extensions;

use App\Models\Task;
use Closure;
use Encore\Admin\Facades\Admin;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Database\Eloquent\Model;

class TasksTree implements Renderable
{

    /**
     * @var string
     */
    protected $elementId = 'tasks-tree-';

    /**
     * @var \App\Models\Module
     */
    protected $module;

    /**
     * @var string
     */
    protected $path;

    /**
     * @var string
     */
    protected $pathSort;

    /**
     * @var string
     */
    protected $pathList;

    /**
     * @var string
     */
    protected $pathBind;

    /**
     * @var string
     */
    protected $pathUnbind;

    /**
     * View of tree to render.
     *
     * @var array
     */
    protected $view = [
        'tree'   => 'admin.module.tree',
        'branch' => 'admin.module.tree.branch',
    ];

    /**
     * @var array
     */
    protected $nestableOptions = [
        'maxDepth' => 1
    ];

    /**
     * Menu constructor.
     *
     * @param \App\Models\Module $module
     */
    public function __construct($module)
    {
        $this->module = $module;

        $this->path = '/' . config('admin.route.prefix') . '/tasks';
        $this->pathSort = '/' . config('admin.route.prefix') . '/api/tasks/sort';
        $this->pathList = '/' . config('admin.route.prefix') . '/api/tasks/list';
        $this->elementId .= uniqid();
    }

    /**
     * Build tree grid scripts.
     *
     * @return string
     */
    protected function script()
    {
        $deleteConfirm = trans('admin.delete_confirm');
        $saveSucceeded = trans('admin.save_succeeded');
        $refreshSucceeded = trans('admin.refresh_succeeded');
        $confirm = trans('admin.confirm');
        $cancel = trans('admin.cancel');

        $nestableOptions = json_encode($this->nestableOptions);

        return <<<SCRIPT

        $('#{$this->elementId}').nestable($nestableOptions);

        $('.tree_branch_delete').click(function() {
            var id = $(this).data('id');
            swal({
              title: "$deleteConfirm",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "$confirm",
              cancelButtonText: "$cancel"
            }).then(function(result) {
                if (result.value) {
                    $.ajax({
                        method: 'post',
                        url: '{$this->path}/' + id,
                        data: {
                            _method:'delete',
                            _token:LA.token,
                        },
                        success: function (data) {
                            $.pjax.reload('#pjax-container');

                            if (typeof data === 'object') {
                                if (data.status) {
                                    swal(data.message, '', 'success');
                                } else {
                                    swal(data.message, '', 'error');
                                }
                            }
                        }
                    });
                }
            });
        });

        $('.{$this->elementId}-save').click(function () {
            var serialize = $('#{$this->elementId}').nestable('serialize');

            $.post('{$this->pathSort}', {
                _token: LA.token,
                _order: JSON.stringify(serialize)
            },
            function(data){
                $.pjax.reload('#pjax-container');
                toastr.success('{$saveSucceeded}');
            });
        });

        $('.{$this->elementId}-refresh').click(function () {
            $.pjax.reload('#pjax-container');
            toastr.success('{$refreshSucceeded}');
        });

SCRIPT;
    }

    /**
     * Set view of tree.
     *
     * @param string $view
     */
    public function setView($view)
    {
        $this->view = $view;
    }

    /**
     * Variables in tree template.
     *
     * @return array
     */
    public function variables()
    {
        return [
            'id'         => $this->elementId,
            'items'      => $this->module->tasks()->order()->get(),
            'module'     => $this->module,
        ];
    }

    /**
     * Render a tree.
     *
     * @return \Illuminate\Http\JsonResponse|string
     */
    public function render()
    {
        Admin::script($this->script());

        view()->share([
            'path'           => $this->path,
            'branchView'     => $this->view['branch'],
        ]);

        return view($this->view['tree'], $this->variables())->render();
    }

    /**
     * Get the string contents of the grid view.
     *
     * @return string
     */
    public function __toString()
    {
        return $this->render();
    }
}
