import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'
import getIconName from '../utils/getIconName'
import SvgIcon from '../components/UI/SvgIcon'
import { catchErrorsNotification } from '../utils/graphql'

class Dialog extends Component {
  constructor(props) {
    super(props)

    this.pool = React.createRef()

    this.state = {
      message: '',
      files: null,
      sending: false
    }

    this.handleMessage = this.handleMessage.bind(this)
    this.handleFiles = this.handleFiles.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.scrollToEnd = this.scrollToEnd.bind(this)
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

    const { thread, sendMessage, data: { refetch } } = this.props
    const { message, files } = this.state

    this.setState({ sending: true })

    sendMessage({
      variables: {
        files: files ? Object.keys(files).map(key => files[key]) : [],
        body: message,
        thread_id: thread
      }
    })
    .finally(() => this.setState({ sending: false }))
    .then(() => {
      refetch().then(this.scrollToEnd)
      this.resetForm()
    })
    .catch(catchErrorsNotification)
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
    const {
      title,
      data: { loading, error, messages }
    } = this.props
    const { sending, files } = this.state

    if (loading)
      return <div className="preloader preloader_absolute" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

    return (
      <div className="practice__chat chat">
        {sending && <div className="preloader preloader_absolute" />}

        <div className="chat__heading">{title}</div>

        <div className="chat__pool" ref={this.pool}>
          {messages.map(message => (
            <article
              className={classNames('chat-item', {
                'chat-item_owner': message.owner
              })}
              key={message.id}
            >
              <img className={`chat-item__avatar`} src={message.user.avatar} alt=""/>
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
                  {message.user.name}, {message.created_at}
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


const query = gql`
  query Dialog($thread_id: Int!) {
  messages(thread_id: $thread_id) {
    id
    body
    read
    files
    created_at
    owner
    user {
      id
      name
      avatar
    }
  }
  }
`
const sendMessageMutation = gql`
mutation SendMessage(
  $files: [Upload]
  $body: String
  $thread_id: Int!
) {
  sendMessage(
    files: $files,
    body: $body,
    thread_id: $thread_id
  ) {
    id
  }
}
`
export default compose(
  graphql(query, {
    options: ({ thread }) => ({
      fetchPolicy: "network-only",
      variables: {
        thread_id: thread
      }
    })
  }),
  graphql(sendMessageMutation, { name: 'sendMessage' })
)(Dialog)