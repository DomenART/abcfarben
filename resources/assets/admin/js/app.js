import React from 'react'
import { render } from 'react-dom'
import TestFormFixation from './components/TestFormFixation'

const TestFormFixationInit = () => {
  const el = document.getElementById('test-form-fixation')
  const { test_id } = el.dataset
  if (el && test_id) {
    render(<TestFormFixation test_id={test_id} />, el)
  }
}
$(document).ready(TestFormFixationInit)
$(document).on('pjax:complete', TestFormFixationInit)