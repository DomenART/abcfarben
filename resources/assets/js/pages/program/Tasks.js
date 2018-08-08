import React, { Component } from 'react'
import { connect } from 'react-redux'
import romanize from "romanize"
import classNames from "classnames"
import Breadcrumbs from "../../components/Breadcrumbs"
import SvgIcon from "../../components/UI/SvgIcon"
import { NavLink as Link } from "react-router-dom"

class Tasks extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {

    }

    getTooltipText(code) {
        switch (code) {
            case 1: return 'Выполнено'
            case 2: return 'В процессе выполнения'
            default: return 'Не выполнено'
        }
    }

    render() {
        const { program } = this.props

        return (
            <main className="tasks">
                <Breadcrumbs
                    items={[{
                        uri: `/programs/${program.data.id}`,
                        title: program.data.name
                    }, {
                        title: 'Участники'
                    }]}
                />

                <h1 className="tasks__page-title page-title">
                    <SvgIcon name="doc" className="page-title__icon page-title__icon_tasks" />
                    Все задания
                </h1>

                {program.modules.map((module, i) => (
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
                                to={`/programs/${program.data.id.id}/${module.id}/${task.id}`}
                                className="module__exercise"
                            >
                                <span
                                    className="module__exercise-title"
                                    dangerouslySetInnerHTML={{__html:task.name}}
                                />
                                <span
                                    className={classNames('module__indicator', 'indicator', {
                                          'indicator_isDone': task.status === 1,
                                          'indicator_isDuring': task.status === 2,
                                          'indicator_isNotDone': task.status !== 2 && task.status !== 1,
                                    })}
                                    data-uk-tooltip={`title: ${this.getTooltipText(task.status)}; pos: right; cls: uk-active indicator__tip;`}
                                />
                            </Link>
                        ))}
                    </div>
                ))}
            </main>
        )
    }
}

const mapStateToProps = store => ({
    program: store.program
})

export default connect(mapStateToProps)(Tasks)