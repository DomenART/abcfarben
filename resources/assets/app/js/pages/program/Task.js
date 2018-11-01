import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import Breadcrumbs from '../../components/Breadcrumbs'
import Head from '../../components/Head'
import Materials from '../../components/Materials'
import Dialog from '../../components/Dialog'
import TestFixation from '../../components/TestFixation'
import TestEvaluation from '../../components/TestEvaluation'

export default ({ task, module, program, readHandler }) =>
  <Fragment>
    <Breadcrumbs
      items={[{
        uri: `/programs/${program.id}`,
        title: program.name
      }, {
        uri: `/programs/${program.id}/${module.id}`,
        title: module.name
      }, {
        title: task.name
      }]}
    />

    <Head title={task.name} />

    {task.has_access ? (
      <Fragment>
        <div className="practice__heading">
          <h1 className="practice__page-title page-title uk-width-1-1">
            <svg className="page-title__icon page-title__icon_practice">
              <use href="#doc" />
            </svg>
            {task.name}
          </h1>

          {task.first_lesson_id && (
            <Link
              to={`/programs/${program.id}/${module.id}/${task.id}/${task.first_lesson_id}/`}
              className="nav-btn"
            >«&nbsp;Уроки</Link>
          )}

          {task.status && (
            <div className="practice__status">
              <span className={classNames('practice__status_indicator indicator', {
                'indicator_isNotDone': task.status === 'primary',
                'indicator_isDone': task.status === 'success',
                'indicator_isDuring': task.status === 'warning',
                'indicator_isDanger': task.status === 'danger'
              })} />
              {task.status === 'primary' && 'Не выполнен'}
              {task.status === 'success' && 'Выполнен'}
              {task.status === 'warning' && 'Выполняется'}
              {task.status === 'danger' && 'Возвращен'}
            </div>
          )}
        </div>

        <div className="practice__exercises exercises">
          <div className="exercises__heading">
            Задание
          </div>
          <div
            className="exercises__text"
            dangerouslySetInnerHTML={{
              __html: task.content
            }}
          />
        </div>

        <Materials files={task.files} />

        {(task.test && task.test.type === 'fixation') && (
          <TestFixation test_id={task.test.id} />
        )}

        {(task.test && task.test.type === 'evaluation') && (
          <TestEvaluation test_id={task.test.id} />
        )}

        <div className="training-nav">
          <div className="training-nav__leftside">
            {(task.type === 'independent' && task.status !== 'success') && (
              <button
                onClick={readHandler}
                className="function-btn"
              >Прочитано</button>
            )}
          </div>

          <div className="training-nav__rightside">
            {Boolean(module.next_module_id) && (
              <Link
                to={`/programs/${program.id}/${module.next_module_id}`}
                className="function-btn"
              >Следующий модуль</Link>
            )}
          </div>
        </div>

        {(task.type === 'default' && task.thread_id) && (
          <Dialog
            title="Переписка с куратором"
            thread={task.thread_id}
          />
        )}
      </Fragment>
    ) : (
      <h1 className="page-title">
        Выполните задания предыдущего модуля
      </h1>
    )}
  </Fragment>