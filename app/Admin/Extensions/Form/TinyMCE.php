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
        $params = [
            'selector' => 'textarea.' . $this->getElementClassString(),
            'theme' => 'modern',
            'plugins' => config('tinymce.plugins'),
            'toolbar1' => config('tinymce.toolbar1'),
            'image_advtab' => true
        ];

        if (!empty(config('tinymce.toolbar2'))) {
            $params['toolbar2'] = config('tinymce.toolbar2');
        }

        $this->script = 'tinymce.init(' . json_encode($params) . ');';

        return parent::render();
    }
}