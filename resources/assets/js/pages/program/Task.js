import React, { Fragment, Component } from 'react'
import { Redirect } from 'react-router'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { connect } from "react-redux"
import Breadcrumbs from '../../components/Breadcrumbs'
import Head from '../../components/Head'
import Dialog from '../../components/Dialog'
import SvgIcon from '../../components/UI/SvgIcon'
import * as taskActions from "../../store/actions/task"
import getIconName from '../../utils/getIconName'

class Task extends Component {
    constructor(props) {
        super(props)

        this.read = this.read.bind(this)
    }

    read() {
        const { program, task, taskActions } = this.props

        taskActions.readTask(program.data.id, task.data.id)
    }

    render() {
        const { program, module, task } = this.props

        if (task.fetching || !program.data || !module.data || !task.data)
            return <div className="preloader preloader_absolute" />

        if (task.error)
            return <h1 dangerouslySetInnerHTML={{__html:task.error}} />

        if (task.nextLesson)
            return (
                <Redirect to={{
                    pathname: `/programs/${program.data.id}/${module.data.id}/${task.data.id}/${task.nextLesson}`
                }} />
            )

        return (
            <Fragment>
                <Breadcrumbs
                    items={[{
                        uri: `/programs/${program.data.id}`,
                        title: program.data.name
                    }, {
                        uri: `/programs/${program.data.id}/${module.data.id}`,
                        title: module.data.name
                    }, {
                        title: task.data.name
                    }]}
                />

                <Head title={`${task.data.name}`} />

                <div className="practice__heading">
                    <h1 className="practice__page-title page-title uk-width-1-1">
                        <svg className="page-title__icon page-title__icon_practice">
                            <use href="#doc" />
                        </svg>
                        {task.data.name}
                    </h1>

                    {task.firstLesson && (
                        <Link
                            to={`/programs/${program.data.id}/${module.data.id}/${task.data.id}/${task.firstLesson}/`}
                            className="nav-btn"
                        >«&nbsp;Уроки</Link>
                    )}

                    <div className="practice__status">
                    <span className={classNames('practice__status_indicator indicator', {
                        'indicator_isDone': task.data.status === 1,
                        'indicator_isDuring': task.data.status === 2,
                        'indicator_isNotDone': task.data.status === 0
                    })} />
                        {task.data.status === 1 && 'Выполнен'}
                        {task.data.status === 2 && 'Выполняется'}
                        {task.data.status === 0 && 'Не выполнен'}
                    </div>
                </div>

                <div className="practice__exercises exercises">
                    <div className="exercises__heading">
                        Задание
                    </div>
                    <div
                        className="exercises__text"
                        dangerouslySetInnerHTML={{
                            __html: task.data.content
                        }}
                    />
                </div>

                {task.data.files && (
                    <div className="practice__materials materials">
                        <div className="materials__heading">Материалы к заданию:</div>
                        <ul className="materials__list">
                            {task.data.files.map((file, key) => (
                                <li key={key}>
                                    <a className="materials__item" href={`/storage/admin/${file}`} target="_blank">
                                        <SvgIcon name={getIconName(file)} className="materials__icon" />
                                        {file.replace(/^.*[\\\/]/, '')}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {task.data.solo ? (
                    <div className="training-nav">
                        <div className="training-nav__leftside">
                            {task.data.status !== 1 && (
                                <button
                                    onClick={this.read}
                                    className="function-btn"
                                >Прочитано</button>
                            )}
                        </div>

                        <div className="training-nav__rightside">
                            {module.data.nextModule && (
                                <Link
                                    to={`/programs/${program.data.id}/${module.data.nextModule}`}
                                    className="function-btn"
                                >Следующий модуль</Link>
                            )}
                        </div>
                    </div>
                ) : task.thread && (
                    <Dialog
                        title="Переписка с куратором"
                        thread={task.thread}
                    />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = store => ({
    task: store.task,
    module: store.module,
    program: store.program
})

const mapDispatchToProps = dispatch => ({
    taskActions: bindActionCreators(taskActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Task)