import React, { Fragment } from 'react'
import { NavLink as Link } from 'react-router-dom'
import Breadcrumbs from '../../components/Breadcrumbs'
import Dialog from '../../components/Dialog'
import SvgIcon from '../../components/UI/SvgIcon'
import Head from "../../components/Head"

const Curator = ({ program }) =>
  <Fragment>
    <Breadcrumbs
      items={[{
        uri: `/programs/${program.id}`,
        title: program.name
      },  {
        title: 'Задать вопрос куратору'
      }]}
    />

    <Head title={`Задать вопрос куратору`} />

    <h1 className="expert__page-title page-title">
      <SvgIcon
        name="bubbles"
        className="page-title__icon page-title__icon_expert"
      />
      Задать вопрос куратору
    </h1>

    {(program.curator_dialog_title || program.curator_dialog_content) && (
      <div className="expert__ad ad">
        {program.curator_dialog_title && (
          <div
            className="ad__heading"
            dangerouslySetInnerHTML={{__html:program.curator_dialog_title}}
          />
        )}
        {program.curator_dialog_content && (
          <div
            className="ad__text"
            dangerouslySetInnerHTML={{__html:program.curator_dialog_content}}
          />
        )}
        {/* <div className="ad__addiction" /> */}
      </div>
    )}

    <Dialog
      title="Вопросы участников к ближайшей сессии “Вопрос-ответ”:"
      thread={program.curator_thread_id}
    />
  </Fragment>

export default Curator