import React, { Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import classNames from 'classnames'
import Head from "../../components/Head"
import SvgIcon from "../../components/UI/SvgIcon"
import NotificationsList from "../../components/NotificationsList"

const Program = ({
  id, name, image, annotation, status, buttonHandler,
  passing_time, completed_time, be_completed_time
}) => {
  const getTimeLabel = () => {
    switch (status) {
      case 'during':
        return 'Программа завершится:'
      case 'completed':
        return 'Программа завершена:'
      case 'available':
      case 'unavailable':
        return 'На прохождение:'
    }
  }

  const getTimeValue = () => {
    switch (status) {
      case 'during':
        return be_completed_time
      case 'completed':
        return completed_time
      case 'available':
      case 'unavailable':
        return passing_time
    }
  }

  const getButtonLabel = () => {
    switch (status) {
      case 'during':
        return 'Продолжить программу'
      case 'completed':
        return 'Программа завершена'
      case 'available':
        return 'Начать программу'
      case 'unavailable':
        return 'Программа не доступна'
    }
  }

  const btnCls = classNames('course-item__link', {
    'course-item__link_continue': status === 'during',
    'course-item__link_ended': status === 'completed' || status === 'unavailable',
    'course-item__link_start': status === 'available'
 })

  return (
    <div>
      <article className="course-item">
        <div className="course-item__main">
          <div className="course-item__main-top">
            {image && <img className="course-item__pic" src={`storage/admin/${image}`} />}
            <h3
              className="course-item__title"
              dangerouslySetInnerHTML={{__html: name}}
            />
            <div
              className="course-item__addition"
              dangerouslySetInnerHTML={{__html: annotation}}
            />
          </div>
          <button onClick={buttonHandler} className={btnCls}>
            {getButtonLabel()}
          </button>
        </div>
        <div className="course-item__bottom">
          <div className="course-item__status">
            <svg className="course-item__info-icon">
              <use href="img/sprite.svg#info" />
            </svg>
            <span
              className="course-item__info-text"
              dangerouslySetInnerHTML={{
                __html: getTimeLabel()
              }}
            />
          </div>
          <div
            className="course-item__date"
            dangerouslySetInnerHTML={{
              __html: getTimeValue()
            }}
          />
        </div>
      </article>
    </div>
  )

}

class Page extends React.Component {
  state = {
    redirect: ''
  }

  componentDidMount() {
    // this.props.authActions.loadNotifications()
  }

  buttonHandler(program) {
    const { startProgram } = this.props
    const redirect = `/programs/${program.id}`

    if (program.status === 'available') {
      startProgram({
        variables: {
          program_id: program.id
        }
      }).then(this.setState({ redirect }))
    } else {
      this.setState({ redirect })
    }
  }

  render() {
    const { programs, currentUser, loading, error } = this.props.data
    const { notifications } = this.props
    const { redirect } = this.state

    if (loading) {
      return <div className="preloader" />
    }

    if (error) {
      return (
        <div className="uk-alert-danger" data-uk-alert>
          <a className="uk-alert-close" data-uk-close></a>
          <p>{error.message}</p>
        </div>
      )
    }

    if (redirect) {
      return <Redirect to={{ pathname: redirect }} />
    }

    return (
      <Fragment>
        <Head />

        <main className="courses page">
          <div className="uk-container">
            <div className="courses__header">
              <Link to="/profile/edit" className="courses__settings">
                <svg className="courses__settings-icon">
                  <use href="img/sprite.svg#settings" />
                </svg>
              </Link>

              <Link to={`/users/${currentUser.id}`}>
                <img className="courses__avatar" src={currentUser.avatar} alt="" />
              </Link>

              <button className="notification-btn" type="button">
                <SvgIcon name="bell" className="notification-btn__icon" />
                {notifications && notifications.length > 0 && (
                  <div className="notification-btn__counter"><span>{notifications.length}</span></div>
                )}
              </button>
              {notifications && notifications.length > 0 && (
                <div className="notifications" data-uk-dropdown="mode: click; pos: right-top;">
                  <div className="notifications__inner">
                    <NotificationsList
                      items={notifications}
                      // deleteNotification={authActions.deleteNotification}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="courses__greetings">Добрый день, {currentUser.secondname} {currentUser.firstname}!</div>
            <div className="courses__choice">Выберите учебную программу:</div>
            <div data-uk-grid className="uk-grid uk-child-width-1-3@m">
              {programs && programs.map(row => (
                <div key={row.id}>
                  <Program
                    {...row}
                    buttonHandler={this.buttonHandler.bind(this, row)}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </Fragment>
    )
  }
}

export default Page