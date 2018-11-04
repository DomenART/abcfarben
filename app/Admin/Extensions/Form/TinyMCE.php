<?php

namespace App\Admin\Extensions\Form;

use Encore\Admin\Form\Field;

class TinyMCE extends Field
{
    protected $view = 'admin.ckeditor';

    protected static $js = [
        '/vendor/tinymce/js/tinymce/tinymce.min.js',
    ];

    public function render()
    {
        $selector = 'textarea.' . $this->getElementClassString();
        $this->script = 'window.TinyMCEControls = window.TinyMCEControls ? window.TinyMCEControls + ", ' . $selector . '" : "' . $selector . '";';

        return parent::render();
    }
}