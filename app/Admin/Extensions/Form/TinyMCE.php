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
            'plugins' => 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample code table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
            'toolbar1' => 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code',
            'image_advtab' => true
        ];

        $this->script = 'tinymce.init(' . json_encode($params) . ');';

        return parent::render();
    }
}