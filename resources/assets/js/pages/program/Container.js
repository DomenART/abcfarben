import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as moduleActions from "../../store/actions/module"
import * as taskActions from "../../store/actions/task"
import * as lessonActions from "../../store/actions/lesson"

class Container extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { module: module_id, task: task_id, lesson: lesson_id } = props.match.params
        const { module, task, lesson } = props

        const moduleLoaded = !module.fetching && module.data && module.data.id === Number(module_id)
        const taskLoaded = !task.fetching && task.data && task.data.id === Number(task_id)
        const lessonLoaded = !lesson.fetching && lesson.data && lesson.data.id === Number(lesson_id)

        let loaded = true

        if (module_id && !moduleLoaded) loaded = false
        if (task_id && !taskLoaded) loaded = false
        if (lesson_id && !lessonLoaded) loaded = false

        return {
            ...state,
            loaded
        }
    }

    componentDidUpdate(prevProps) {
        const { module: module_id, task: task_id, lesson: lesson_id } = this.props.match.params

        if (module_id && module_id !== prevProps.match.params.module) {
            this.loadModule(module_id)
        }

        if (task_id && task_id !== prevProps.match.params.task) {
            this.loadTask(task_id)
        }

        if (lesson_id && lesson_id !== prevProps.match.params.lesson) {
            this.loadLesson(lesson_id)
        }
    }

    componentDidMount() {
        const { module: module_id, task: task_id, lesson: lesson_id } = this.props.match.params

        if (module_id) {
            this.loadModule(module_id)
        }

        if (task_id) {
            this.loadTask(task_id)
        }

        if (lesson_id) {
            this.loadLesson(lesson_id)
        }
    }

    loadModule(module) {
        const { loadModule } = this.props.moduleActions
        const { id: program_id } = this.props.program.data
        loadModule(program_id, module)
    }

    loadTask(task) {
        const { loadTask } = this.props.taskActions
        const { id: program_id } = this.props.program.data
        loadTask(program_id, task)
    }

    loadLesson(lesson) {
        const { loadLesson } = this.props.lessonActions
        const { id: program_id } = this.props.program.data
        loadLesson(program_id, lesson)
    }

    render() {
        const { component: Component } = this.props

        if (!this.state.loaded)
            return <div className="preloader preloader_absolute" />

        return <Component />
    }
}

const mapStateToProps = store => ({
    program: store.program,
    module: store.module,
    task: store.task,
    lesson: store.lesson,
})

const mapDispatchToProps = dispatch => ({
    moduleActions: bindActionCreators(moduleActions, dispatch),
    taskActions: bindActionCreators(taskActions, dispatch),
    lessonActions: bindActionCreators(lessonActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)