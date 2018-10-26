import React, { Fragment } from 'react'
import { NavLink as Link } from 'react-router-dom'
import romanize from "romanize"
import SvgIcon from '../../components/UI/SvgIcon'
import Head from "../../components/Head"

const Main = ({ id, name, modules }) => {
  const getStatusIcon = status => {
    switch (status) {
        case 'success': return 'doc-done'
        case 'warning': return 'doc-warning'
        case 'danger': return 'doc-danger'
        default: return 'doc'
    }
  }

  return (
    <Fragment>
      <Head title={`${name}`} />

      <h1 className="program__title">
        Программа:
        <span>"{name}"</span>
      </h1>

      {/* <div className="program__headway headway">
        <div className="headway__leftside">
          <SvgIcon name="settings" className="headway__icon" />
          <div className="headway__text">Текущая степень систематизации вашего бизнеса:</div>
          <div className="headway__value">78%</div>
        </div>
        <button className="headway__btn" type="button">
          <SvgIcon name="refresh" className="headway__btn-icon" />
          <span className="headway__btn-text">
            Актуализировать
          </span>
        </button>
      </div> */}

      <div className="program__structure-heading">
        Структура программы
      </div>

      <ul className="structure">
        {modules && modules.map((module, i) => (
          <li key={module.id}>
            <Link
              to={`/programs/${id}/${module.id}`}
              className="structure__section"
            >
              <span className="structure__section-pic">
                <SvgIcon name="folder" className="structure__section-icon" />
              </span>
              <span className="structure__section-title">
                {romanize(i+1)}. {module.name}
              </span>
            </Link>
            {Boolean(module.tasks.length) && (
              <Fragment>
                <button
                  className="structure__control structure__control_isOpened"
                  type="button"
                  data-uk-toggle={`cls: structure__control_isOpened`}
                />
                <ul className="structure__subsection-list">
                  {module.tasks.map(task => (
                    <li key={task.id}>
                      <Link
                        to={`/programs/${id}/${module.id}/${task.id}`}
                        className="structure__subsection"
                      >
                        <SvgIcon name={getStatusIcon(task.status)} className="structure__subsection-icon-done" />
                        <span
                          className="structure__subsection-title"
                          dangerouslySetInnerHTML={{__html:task.name}}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Fragment>
            )}
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

export default Main