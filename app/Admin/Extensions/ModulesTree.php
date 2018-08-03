<?php

namespace App\Admin\Extensions;

use App\Models\ProgramModule;
use App\Models\Module;
use Closure;
use Encore\Admin\Facades\Admin;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Database\Eloquent\Model;

class ModulesTree implements Renderable
{

    /**
     * @var string
     */
    protected $elementId = 'extensions-';

    /**
     * @var \App\Models\Program
     */
    protected $program;

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
        'tree'   => 'admin.program.tree',
        'branch' => 'admin.program.tree.branch',
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
     * @param \App\Models\Program $program
     */
    public function __construct($program)
    {
        $this->program = $program;

        $this->path = '/' . config('admin.route.prefix') . '/modules';
        $this->pathSort = '/' . config('admin.route.prefix') . '/api/modules/sort';
        $this->pathList = '/' . config('admin.route.prefix') . '/api/modules/list';
        $this->pathBind= '/' . config('admin.route.prefix') . '/api/modules/bind';
        $this->pathUnbind= '/' . config('admin.route.prefix') . '/api/modules/unbind';
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

        var modulesTreeSelect = $(".{$this->elementId}-modules-select");

        $('#{$this->elementId}').nestable($nestableOptions);

        $('.tree_branch_delete').click(function() {
            var id = $(this).data('id');
            swal({
              title: "$deleteConfirm",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "$confirm",
              closeOnConfirm: false,
              cancelButtonText: "$cancel"
            },
            function(){
                $.ajax({
                    method: 'post',
                    url: '{$this->pathUnbind}/' + id,
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

        $('.{$this->elementId}-add').click(function () {
            $.post('{$this->pathBind}', {
                _token: LA.token,
                program: {$this->program->id},
                module: modulesTreeSelect.val()
            },
            function(data){
                $.pjax.reload('#pjax-container');
                toastr.success('{$saveSucceeded}');
            });
        });

        $(".{$this->elementId}-modules-select").select2({
            placeholder: "Выбрать модуль",
            allowClear: true,
            ajax: {
                url: "{$this->pathList}",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        query: params.term,
                        program: {$this->program->id},
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;

                    return {
                        results: $.map(data.data, function (d) {
                            d.id = d.id;
                            d.text = d.text;
                            return d;
                        }),
                        pagination: {
                            more: data.next_page_url
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                return markup;
            }
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
            'items'      => $this->program->modules,
            'program'    => $this->program,
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
