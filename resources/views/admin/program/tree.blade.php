<div class="box">

    <div class="box-header">

        <div class="btn-group">
            <a class="btn btn-info {{ $id }}-save">
                <i class="fa fa-save"></i>&nbsp;{{ trans('admin.save') }}
            </a>
        </div>
        
        <div class="btn-group">
            <a class="btn btn-warning {{ $id }}-refresh">
                <i class="fa fa-refresh"></i>&nbsp;{{ trans('admin.refresh') }}
            </a>
        </div>

        <div class="pull-right">

            <div class="btn-group">
                <div class="modules-tree-select">
                    <select class="{{ $id }}-modules-select"></select>
                </div>
                <a class="btn btn-success {{ $id }}-add" data-toggle="modal">
                    <i class="fa fa-plus"></i>&nbsp;Добавить
                </a>
            </div>

            <div class="btn-group">
                <a class="btn btn-success" href="{{ $path }}/create?program={{ $program->id }}">
                    <i class="fa fa-save"></i>&nbsp;Создать
                </a>
            </div>

        </div>

    </div>
    <!-- /.box-header -->

    <div class="box-body table-responsive no-padding">
        <div class="dd" id="{{ $id }}">
            <ol class="dd-list dd-list_roman">
                @each($branchView, $items, 'branch')
            </ol>
        </div>
    </div>
    <!-- /.box-body -->
</div>
