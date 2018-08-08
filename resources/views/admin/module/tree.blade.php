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
                <a class="btn btn-success" href="{{ $path }}/create?module_id={{ $module->id }}">
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
