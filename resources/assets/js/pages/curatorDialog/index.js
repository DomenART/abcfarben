import React, {Fragment} from 'react'
import Http from '../../Http'
import { Link } from 'react-router-dom'
import HeaderContainer from "../../containers/HeaderContainer"
import Dialog from "../../components/Dialog"
import SvgIcon from "../../components/UI/SvgIcon"
import getIconName from "../../utils/getIconName"

class Page extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            type: null,
            status: null,
            loaded: false,
            error: null
        }

        this.acceptTask = this.acceptTask.bind(this)
        this.loadDialog = this.loadDialog.bind(this)
    }

    componentDidMount() {
        this.loadDialog()
    }

    loadDialog() {
        const { match } = this.props

        Http.get(`/api/curator/dialogs/${match.params.thread}`)
            .then(response => {
                this.setState({
                    ...response.data,
                    loaded: true
                })
            })
            .catch(({ response }) => {
                this.setState({
                    loaded: true,
                    error: response.data.message
                })
            })
    }

    acceptTask() {
        const { match } = this.props

        Http.post(`/api/curator/accept`, {
            thread: match.params.thread
        })
            .then(response => {
                if (response.data.success) {
                    this.setState({
                        status: 1
                    })
                }
            })
            .catch(({ response }) => {
                UIkit.notification(response.data.message, {
                    status: 'danger'
                })
            })
    }

    getContent() {
        const { match } = this.props
        const { task, program, type, status, loaded, error } = this.state

        if (!loaded) {
            return <div className="preloader preloader_absolute" />
        }

        if (error) {
            return <div className="uk-alert-danger" dangerouslySetInnerHTML={{__html:error}} />
        }

        const title = type === 'task' ? (
            <div className="uk-flex uk-flex-between uk-flex-center">
                <div>Переписка к заданию "{task.name}"</div>
                {status === 1 ? (
                    <div className="practice__status"><span className="practice__status_indicator indicator indicator_isDone"/> Выполнен</div>
                ) : (
                    <button
                        className="uk-button uk-button-primary uk-button-small"
                        onClick={this.acceptTask}
                    >Принять</button>
                )}
            </div>
        ) : `Переписка к программе "${program.name}"`

        return (
            <Fragment>
                {type === 'task' && (
                    <Fragment>
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

                        {task.files && (
                            <div className="practice__materials materials">
                                <div className="materials__heading">Материалы к заданию:</div>
                                <ul className="materials__list">
                                    {task.files.map((file, key) => (
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
                    </Fragment>
                )}

                <Dialog
                    title={title}
                    thread={match.params.thread}
                />
            </Fragment>
        )
    }

    render() {
        return (
            <main className="page">
                <HeaderContainer />

                <div className="uk-container">
                    <br />
                    {this.getContent()}
                    <br />
                </div>
            </main>
        )
    }
}

export default Page