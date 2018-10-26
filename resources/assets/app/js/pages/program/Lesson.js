import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/Breadcrumbs'
import Head from '../../components/Head'

export default ({ lesson, task, module, program, readHandler }) =>
  <Fragment>
    <Breadcrumbs
      items={[{
        uri: `/programs/${program.id}`,
        title: program.name
      }, {
        uri: `/programs/${program.id}/${module.id}`,
        title: module.name
      }, {
        uri: `/programs/${program.id}/${module.id}/${task.id}`,
        title: task.name
      }, {
        title: lesson.name
      }]}
    />

    <Head title={lesson.name} />

    {lesson.has_access ? (
      <Fragment>
        <h1 className="page-title">
          <svg className="page-title__icon page-title__icon_practice">
            <use href="#doc" />
          </svg>
          {lesson.name}
        </h1>

        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: lesson.content
          }}
        />

        <div className="training-nav">
          <div className="training-nav__leftside">
            {lesson.previous_lesson_id && (
              <Link
                to={`/programs/${program.id}/${module.id}/${task.id}/${lesson.previous_lesson_id}`}
                className="nav-btn"
              >« Предыдущий урок</Link>
            )}

            {!lesson.next_lesson_id ? (
              <button
                className="link-btn"
                onClick={readHandler}
              >Перейти к заданию</button>
            ) : (
              <button
                className="function-btn"
                onClick={readHandler}
              >Прочитано</button>
            )}

            {(lesson.next_lesson_id && lesson.status === 'success') && (
              <Link
                to={`/programs/${program.id}/${module.id}/${task.id}/${lesson.next_lesson_id}`}
                className="nav-btn"
              >Следующий урок »</Link>
            )}
          </div>

          <div className="training-nav__rightside">
            {module.next_module_id && (
              <Link
                to={`/programs/${program.id}/${module.next_module_id}`}
                className="function-btn"
              >Следующий модуль</Link>
            )}
          </div>
        </div>
      </Fragment>
    ) : (
      <h1 className="page-title">
        Выполните задания предыдущего модуля
      </h1>
    )}
  </Fragment>