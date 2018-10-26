import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import Breadcrumbs from '../../components/Breadcrumbs'
import Head from "../../components/Head"

export default ({ module, program, readHandler }) =>
  <Fragment>
    <Breadcrumbs
      items={[{
        uri: `/programs/${program.id}`,
        title: program.name
      }, {
        title: module.name
      }]}
    />

    <Head title={`${module.name}`} />

    {module.has_access ? (
      <Fragment>
        <h1 className="subsection__page-title page-title">
          <svg className="page-title__icon page-title__icon_subsection">
            <use href="#doc" />
          </svg>
          {module.name}
        </h1>

        <div
          className="content"
          dangerouslySetInnerHTML={{__html:module.content}}
        />

        {Boolean(module.opened) && (
          <div className="subsection__link-btn">
            {(!!module.tasks.length && !!module.next_task_id) && (
              <Link
                to={`/programs/${program.id}/${module.id}/${module.next_task_id}`}
                className="link-btn"
              >Приступить к просмотру и выполнению уроков</Link>
            )}
            {(!!!module.tasks.length && module.status !== 'success') && (
              <button className="link-btn" onClick={readHandler}>
                Я ознакомился
              </button>
            )}
          </div>
        )}

        {Boolean(module.tasks.length) && (
          <div className="subsection__lessons lessons">
            <div className="lessons__heading">
              <div className="lessons__title">
                <svg className="lessons__title-icon">
                  <use href="#doc" />
                </svg>
                Уроки модуля
              </div>
              <div className="lessons__legend">
                <div className="lessons__legend-item">
                  <span className="lessons__legend-indicator indicator indicator_isDone" />
                  Выполнен
                </div>
                <div className="lessons__legend-item">
                  <span className="lessons__legend-indicator indicator indicator_isDuring" />
                  Выполняется
                </div>
                <div className="lessons__legend-item">
                  <span className="lessons__legend-indicator indicator indicator_isNotDone" />
                  Не выполнен
                </div>
              </div>
            </div>
            <ul className="lessons__list">
              {module.tasks.map(task => (
                <li key={task.id}>
                  <Link
                    to={`/programs/${program.id}/${module.id}/${task.id}`}
                    className="lessons__item"
                  >
                  <span className={classNames('lessons__item-indicator indicator', {
                    'indicator_isDone': task.status === 'success',
                    'indicator_isDuring': task.status === 'warning' || task.status === 'danger',
                    'indicator_isNotDone': task.status === 'primary',
                  })} />
                    <span
                      className="lessons__item-title"
                      dangerouslySetInnerHTML={{__html:task.name}}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {Boolean(module.next_module_id) && (
          <div className="training-nav">
            <div className="training-nav__rightside">
              <Link
                to={`/programs/${program.id}/${module.next_module_id}`}
                className="function-btn"
              >Следующий модуль</Link>
            </div>
          </div>
        )}
      </Fragment>
    ) : (
      <h1 className="page-title">
        Выполните задания предыдущего модуля
      </h1>
    )}
  </Fragment>