import React, { Fragment } from 'react'
import Head from '../../components/Head'
import SvgIcon from '../../components/UI/SvgIcon'
import Dialog from '../../components/Dialog'

export default ({ curator_dialog_content, curator_dialog_title, curator_thread_id }) =>
  <Fragment>
    <Head title={`Задать вопрос куратору`} />

    <h1 className="expert__page-title page-title">
      <SvgIcon
        name="bubbles"
        className="page-title__icon page-title__icon_expert"
      />
      Задать вопрос куратору
    </h1>

    {(curator_dialog_title || curator_dialog_content) && (
      <div className="expert__ad ad">
        {curator_dialog_title && (
          <div
            className="ad__heading"
            dangerouslySetInnerHTML={{__html:curator_dialog_title}}
          />
        )}
        {curator_dialog_content && (
          <div
            className="ad__text"
            dangerouslySetInnerHTML={{__html:curator_dialog_content}}
          />
        )}
      </div>
    )}

    <Dialog
      title="Вопросы участников к ближайшей сессии “Вопрос-ответ”:"
      thread={curator_thread_id}
    />
  </Fragment>