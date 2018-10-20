import React from 'react'
import romanize from "romanize"
import classNames from "classnames"
import Breadcrumbs from "../../components/Breadcrumbs"
import SvgIcon from "../../components/UI/SvgIcon"
import { NavLink as Link } from "react-router-dom"
import Head from "../../components/Head"

const Tasks = ({ id, name, modules }) => {
  const getTooltipText = (status) => {
    switch (status) {
      case 'success': return 'Выполнено'
      case 'warning': return 'В процессе выполнения'
      case 'danger': return 'Возращено на доработку'
      default: return 'Не выполнено'
    }
  }

  return (
    <main className="tasks">
      <Breadcrumbs
        items={[{
          uri: `/programs/${id}`,
          title: name
        }, {
          title: 'Все задания'
        }]}
      />

      <Head title={`Все задания - ${name}`} />

      <h1 className="tasks__page-title page-title">
        <SvgIcon name="doc" className="page-title__icon page-title__icon_tasks" />
        Все задания
      </h1>

      {modules.map((module, i) => (
        <div className="tasks__module module uk-table" key={module.id}>
          <div className="module__title">
            {romanize(i+1)}. {module.name}
          </div>

          <div className="module__heading">
            <div>Задание</div>
            <div>Статус</div>
          </div>

          {module.tasks.map(task => (
            <Link
              key={task.id}
              to={`/programs/${id}/${module.id}/${task.id}`}
              className="module__exercise"
            >
              <span
                className="module__exercise-title"
                dangerouslySetInnerHTML={{__html:task.name}}
              />
              <span
                className={classNames('module__indicator', 'indicator', {
                    'indicator_isDone': task.status === 'success',
                    'indicator_isDuring': task.status === 'warning' || task.status === 'danger',
                    'indicator_isNotDone': task.status === 'primary',
                })}
                data-uk-tooltip={`title: ${getTooltipText(task.status)}; pos: right; cls: uk-active indicator__tip;`}
              />
            </Link>
          ))}
        </div>
      ))}
    </main>
  )
}

export default Tasks