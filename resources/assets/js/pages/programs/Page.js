import React, {Fragment} from 'react'
import Http from '../../Http'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import * as actions from '../../store/actions/auth'
import Head from "../../components/Head"
import SvgIcon from "../../components/UI/SvgIcon"
import NotificationsList from "../../components/NotificationsList"

const Program = props => {

    const {
        id, name, image, annotation, status,
        passing_time, completed_time, be_completed_time
    } = props

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

    return (
        <div>
            <article className="course-item">
                <div className="course-item__main">
                    <div className="course-item__main-top">
                        <img className="course-item__pic" src={`storage/admin/${image}`} alt="" />
                        <h3
                            className="course-item__title"
                            dangerouslySetInnerHTML={{__html: name}}
                        />
                        <div
                            className="course-item__addition"
                            dangerouslySetInnerHTML={{__html: annotation}}
                        />
                    </div>
                    <Link
                        to={`/programs/${id}`}
                        className={classNames('course-item__link', {
                           'course-item__link_continue': status === 'during',
                           'course-item__link_ended': status === 'completed' || status === 'unavailable',
                           'course-item__link_start': status === 'available'
                        })}
                        dangerouslySetInnerHTML={{__html: getButtonLabel()}}
                    />
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
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            loading: true
        }
    }

    componentDidMount() {
        this.loadPrograms()

        this.props.authActions.loadNotifications()
    }

    loadPrograms() {
        Http.get('/api/programs').then(response => {
            this.setState({
                data: response.data.data,
                loading: false
            })
        })
    }

    render() {
        const { data, loading } = this.state
        const { user, notifications, authActions } = this.props

        return (
            <Fragment>
                <Head />

                {loading && (<div className="preloader" />)}

                <main className="courses page">
                    <div className="uk-container">
                        <div className="courses__header">
                            <Link to="/profile/edit" className="courses__settings">
                                <svg className="courses__settings-icon">
                                    <use href="img/sprite.svg#settings" />
                                </svg>
                            </Link>

                            <Link to={`/users/${user.id}`}>
                                <img className="courses__avatar" src={user.avatar} alt="" />
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
                                            deleteNotification={authActions.deleteNotification}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="courses__greetings">Добрый день, {user.name}!</div>
                        <div className="courses__choice">Выберите учебную программу:</div>
                        <div data-uk-grid className="uk-grid uk-child-width-1-3@m">
                            {data.map(row => (
                                <div key={row.id}>
                                    <Program {...row} />
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