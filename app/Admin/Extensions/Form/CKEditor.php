<?php

namespace App\Admin\Extensions\Form;

use Encore\Admin\Form\Field;

class CKEditor extends Field
{
    protected $view = 'admin.ckeditor';

    protected static $js = [
        '/vendor/ckeditor5-build-classic/ckeditor.js',
    ];

    public function render()
    {
        $name = $this->formatName($this->column);
        $element = "document.querySelector( 'textarea.{$this->getElementClassString()}' )";
        $params = json_encode([
            'ckfinder' => [
                'uploadUrl' => '/' . config('admin.route.prefix') . '/api/ckeditor5/upload'
            ]
        ]);

        $this->script = "ClassicEditor.create( {$element}, {$params} ).catch( error => {console.error( error );} );";

        return parent::render();
    }
}