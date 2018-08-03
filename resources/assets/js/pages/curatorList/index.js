import React from 'react'
import { connect } from 'react-redux'
import Http from '../../Http'
import { Link } from 'react-router-dom'
import Header from "../../components/Header"

class Page extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            threads: [],
            loaded: false,
            error: null
        }
    }

    componentDidMount() {
        this.loadDialogs()
    }

    loadDialogs() {
        Http.get(`/api/curator/dialogs`)
            .then(response => {
                this.setState({
                    threads: response.data.threads,
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

    getContent() {
        const { threads, loaded, error } = this.state

        if (!loaded) {
            return <div className="preloader preloader_absolute" />
        }

        if (error) {
            return <div className="uk-alert-danger" dangerouslySetInnerHTML={{__html:error}} />
        }

        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th>Программа</th>
                        <th>Задание</th>
                        <th>Пользователь</th>
                        <th>Сообщений</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(threads).map(key => {
                        const { thread, user, task, program, messages, unread } = threads[key]

                        return (
                            <tr key={key}>
                                <td>{program.name}</td>
                                <td>{task ? task.name : '-'}</td>
                                <td>
                                    <Link to={`/users/${user.id}`}>
                                        {user.firstname}{user.secondname && ` ${user.secondname}`}
                                    </Link>
                                </td>
                                <td>
                                    {messages}{Boolean(unread) && ` (+${unread})`}
                                </td>
                                <td>
                                    <Link to={`/curator/${thread}`} className="uk-button uk-button-default uk-button-small">
                                        Смотреть переписку
                                    </Link>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    render() {
        const { user } = this.props

        return (
            <main className="page">
                <Header user={user} />

                <div className="uk-container">
                    {this.getContent()}
                </div>
            </main>
        )
    }
}

const mapStateToProps = store => ({
    user: store.Auth.user
})

export default connect(mapStateToProps)(Page)