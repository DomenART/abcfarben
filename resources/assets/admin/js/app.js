import React from 'react'
import { render } from 'react-dom'
import TestFormFixation from './components/TestFormFixation'

const TestFormFixationInit = () => {
  const el = document.getElementById('test-form-fixation')
  if (el) {
    const { test_id } = el.dataset
    if (test_id) {
      render(<TestFormFixation test_id={test_id} />, el)
    }
  }
}
$(document).ready(TestFormFixationInit)
$(document).on('pjax:complete', TestFormFixationInit)

const TinyMCEInit = () => {
  if (window.TinyMCEControls) {
    tinymce.remove(window.TinyMCEControls);
    tinymce.init({
      selector: window.TinyMCEControls,
      theme: 'modern',
      plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample code table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
      toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code',
      image_advtab: true,
    })
  }
}
$(document).ready(TinyMCEInit)
$(document).on('pjax:complete', TinyMCEInit)