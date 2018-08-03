import React, { Fragment, Component } from 'react'
import classNames from 'classnames'
import getIconName from '../utils/getIconName'
import SvgIcon from '../components/UI/SvgIcon'
import Http from "../Http"

class Dialog extends Component {
    constructor(props) {
        super(props)

        this.pool = React.createRef()

        this.state = {
            messages: null,
            message: '',
            files: null,
            loading: false,
            sending: false
        }

        this.handleMessage = this.handleMessage.bind(this)
        this.handleFiles = this.handleFiles.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.scrollToEnd = this.scrollToEnd.bind(this)
    }

    componentDidMount() {
        this.loadMessages()
    }

    loadMessages() {
        const { thread } = this.props

        this.setState({
            loading: true
        }, () => {
            Http.get(`/api/messages?thread=${thread}`)
            .then(response => {
                this.setState({
                    messages: response.data.data,
                    loading: false
                }, () => {
                    this.scrollToEnd()
                })
            })
            .catch(({ response }) => {
                this.setState({
                    loading: false
                })
                UIkit.notification(response.data.message, {
                    status: 'danger'
                })
            })
        })
    }

    handleMessage(event) {
        this.setState({
            message: event.target.value
        })
    }

    handleFiles(event) {
        const files = event.target.files || event.dataTransfer.files
        const objFiles = {}

        Object.keys(files).forEach(key => {
            objFiles[files[key].name] = files[key]
        })

        this.setState({
            files: {
                ...this.state.files,
                ...objFiles
            }
        })
    }

    handleSubmit(event) {
        event.preventDefault()

        const { thread } = this.props
        const { message, files } = this.state

        const formData = new FormData()
        formData.append('message', message)
        formData.append('thread', thread)
        if (files) {
            Object.keys(files).forEach(key => {
                formData.append('attachments[]', files[key])
            })
        }

        this.setState({
            sending: true
        }, () => {
            Http.post(`/api/messages`, formData)
            .then(response => {
                const messages = [...this.state.messages]
                messages.push(response.data.data)
                this.setState({
                    sending: false,
                    messages
                }, () => {
                    this.scrollToEnd()
                    this.resetForm()
                })
            })
            .catch(({ response }) => {
                this.setState({
                    sending: false
                })
                UIkit.notification(response.data.message, {
                    status: 'danger'
                })
            })
        })
    }

    removeFile(key) {
        let files = {...this.state.files}
        delete files[key]
        this.setState({ files })
    }

    scrollToEnd() {
        this.pool.current.scrollTop = this.pool.current.scrollHeight
    }

    resetForm() {
        this.setState({
            message: '',
            files: null
        })
    }

    render() {
        const { title } = this.props
        const { messages, loading, sending, files } = this.state

        return (
            <div className="practice__chat chat">
                {loading && (
                    <div className="preloader preloader_absolute" />
                )}

                <div
                    className="chat__heading"
                >
                    {title}
                </div>
                <div className="chat__pool" ref={this.pool}>
                    {messages && messages.map(message => (
                        <article
                            className={classNames('chat-item', {
                                'chat-item_owner': message.owner
                            })}
                            key={message.id}
                        >
                            <img className={`chat-item__avatar`} src={message.avatar} alt=""/>
                            <div>
                                <div className={`chat-item__message`}>
                                    <div dangerouslySetInnerHTML={{__html:message.body}} />
                                    {Boolean(message.files.length) && (
                                        <div className={`chat-item__files`}>
                                            <ul className="materials__list">
                                                {message.files.map(file => (
                                                    <li key={file}>
                                                        <a className="materials__item" href={file} target="_blank">
                                                            <SvgIcon
                                                                name={getIconName(file)}
                                                                className="materials__icon"
                                                            />
                                                            {file.split('/').pop()}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className={`chat-item__author`}>
                                    {message.author}, {message.created_at}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                {files && (
                    <div className="chat-attachments">
                        {Object.keys(files).map(key => {
                            const file = files[key]
                            const icon = getIconName(file.name)

                            return (
                                <div className="chat-attachment" key={key}>
                                    <SvgIcon name={icon} className="chat-attachment__icon" />
                                    <div
                                        className="chat-attachment__name"
                                        dangerouslySetInnerHTML={{__html:file.name}}
                                    />
                                    <span
                                        uk-icon="close"
                                        className="chat-attachment__remove"
                                        onClick={() => this.removeFile(key)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
                <div className={classNames("chat__input", {'chat__input_sending': sending})}>
                    <form
                        className="chat__form"
                        onSubmit={this.handleSubmit}
                    >
                        <textarea
                            className="chat__textarea uk-textarea"
                            placeholder="Введите текст"
                            required
                            value={this.state.message}
                            onChange={this.handleMessage}
                        />
                        <div className="chat__attachment" data-uk-form-custom>
                            <input type="file" onChange={this.handleFiles} multiple />
                        </div>
                        <button className="chat__send" type="submit">
                            <svg className="chat__send-icon">
                                <use href="#send"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Dialog