import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { bindActionCreators } from 'redux'
import * as taskActions from "../../store/actions/task"
import * as lessonActions from "../../store/actions/lesson"
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/Breadcrumbs'

class Lesson extends Component {
    static initialState
    constructor(props) {
        super(props)

        this.state = {
            redirect: null
        }

        this.read = this.read.bind(this)
    }

    read() {
        const { program, module, task, lesson, lessonActions, taskActions } = this.props

        lessonActions.readLesson(program.data.id, lesson.data.id)

        if (lesson.next) {
            this.setState({
                redirect: `/programs/${program.data.id}/${module.data.id}/${task.data.id}/${lesson.next.id}`
            })
        } else {
            taskActions.clearNextLesson()
            this.setState({
                redirect: `/programs/${program.data.id}/${module.data.id}/${task.data.id}`
            })
        }
    }

    render() {
        const { program, module, task, lesson } = this.props

        if (lesson.fetching || !program.data || !module.data || !task.data || !lesson.data)
            return <div className="preloader preloader_absolute" />

        if (lesson.error)
            return <h1 dangerouslySetInnerHTML={{__html:lesson.error}} />

                // && !lesson.data.readFetching
        if (this.state.redirect)
            return <Redirect to={{ pathname: this.state.redirect }} />

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
                        uri: `/programs/${program.data.id}/${module.data.id}/${task.data.id}`,
                        title: task.data.name
                    }, {
                        title: lesson.data.name
                    }]}
                />

                <h1 className="page-title">
                    <svg className="page-title__icon page-title__icon_practice">
                        <use href="#doc" />
                    </svg>
                    {lesson.data.name}
                </h1>

                <div
                    className="content"
                    dangerouslySetInnerHTML={{
                        __html: lesson.data.content
                    }}
                />

                <div className="training-nav">
                    <div className="training-nav__leftside">
                        {lesson.previous && (
                            <Link
                                to={`/programs/${program.data.id}/${module.data.id}/${task.data.id}/${lesson.previous.id}`}
                                className="nav-btn"
                            >« Предыдущий урок</Link>
                        )}

                        {!lesson.next ? (
                            <button
                                className="link-btn"
                                onClick={this.read}
                            >Перейти к заданию</button>
                        ) : (
                            <button
                                className="function-btn"
                                onClick={this.read}
                            >Прочитано</button>
                        )}

                        {(lesson.next && lesson.data.status === 1) && (
                            <Link
                                to={`/programs/${program.data.id}/${module.data.id}/${task.data.id}/${lesson.next.id}`}
                                className="nav-btn"
                            >Следующий урок »</Link>
                        )}
                    </div>

                    <div className="training-nav__rightside">
                        {module.data.nextModule && (
                            <Link
                                to={`/programs/${program.data.id}/.page-title${module.data.nextModule}`}
                                className="function-btn"
                            >Следующий модуль</Link>
                        )}
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = store => ({
    lesson: store.lesson,
    task: store.task,
    module: store.module,
    program: store.program
})

const mapDispatchToProps = dispatch => ({
    lessonActions: bindActionCreators(lessonActions, dispatch),
    taskActions: bindActionCreators(taskActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Lesson)