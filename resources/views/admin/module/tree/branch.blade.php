<li class="dd-item" data-id="{{ $branch->id }}">
    <div class="dd-handle">
        {!! $branch->name !!}
        <span class="pull-right dd-nodrag">
            <a href="{{ $path }}/{{ $branch->id }}/edit"><i class="fa fa-edit"></i></a>
            <a href="javascript:void(0);" data-id="{{ $branch->id }}" class="tree_branch_delete"><i class="fa fa-trash"></i></a>
        </span>
    </div>
</li>