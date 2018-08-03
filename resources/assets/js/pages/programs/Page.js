import React, {Fragment} from 'react'
import Http from '../../Http'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import * as actions from '../../store/actions/auth'

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
        const { user } = this.props

        return (
            <Fragment>
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
                                <svg className="notification-btn__icon">
                                    <use href="img/sprite.svg#bell" />
                                </svg>
                                <div className="notification-btn__counter"><span>348</span></div>
                            </button>
                            <div className="courses__notifications-pool" data-uk-dropdown="mode: click; pos: right-top;">
                                <div className="courses__notifications-container">
                                <div className="courses__notifications-inner">
                                    <div className="notification-item">
                                        <div className="notification-item__title">
                                            Программа, к которой относится уведомление
                                        </div>
                                        <div className="notification-item__info">
                                            <a className="notification-item__link" href="#">
                                                <span className="notification-item__calendar">
                                                    <svg className="notification-item__calendar-icon">
                                                        <use href="img/sprite.svg#calendar" />
                                                    </svg>
                                                </span>
                                                <span className="notification-item__text">
                                                    Дополнительное образование (психология бизнеса), тренинги, полиграф, консалтинг, исследования
                                                </span>
                                            </a>
                                            <button className="notification-item__remove-btn" type="button" />
                                        </div>
                                    </div>
                                    <div className="notification-item">
                                        <div className="notification-item__title">
                                            Программа, к которой относится уведомление
                                        </div>
                                        <div className="notification-item__info">
                                            <a className="notification-item__link" href="#">
                                                <span className="notification-item__calendar">
                                                    <svg className="notification-item__folder-icon">
                                                        <use href="img/sprite.svg#folder" />
                                                    </svg>
                                                </span>
                                                <span className="notification-item__text">
                                                    Открыт доступ к программе курса
                                                </span>
                                            </a>
                                            <button className="notification-item__remove-btn" type="button" />
                                        </div>
                                        <div className="notification-item__info">
                                            <a className="notification-item__link" href="#">
                                                <span className="notification-item__calendar">
                                                    <svg className="notification-item__folder-icon">
                                                        <use href="img/sprite.svg#folder" />
                                                    </svg>
                                                </span>
                                                <span className="notification-item__text">
                                                    Открыт доступ к программе курса
                                                </span>
                                            </a>
                                            <button className="notification-item__remove-btn" type="button" />
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="courses__greetings">Добрый день, {user.name}!</div>
                        <div className="courses__choice">Выберите учебную программу:</div>
                        <div data-uk-grid className="uk-grid uk-child-width-1-3@m">
                            {data.map(row => (
                                <div key={row.id}>
                                    <Program {...row} />
                                </div>
                            ))}
                            {/* <div>
                                <article className="course-item">
                                    <div className="course-item__main">
                                        <div className="course-item__main-top">
                                            <img className="course-item__pic" src="../img/course.svg" alt="" />
                                            <h3 className="course-item__title">
                                                Название программы, курса
                                            </h3>
                                            <div className="course-item__addition">
                                                дополнение, уточнение
                                            </div>
                                        </div>
                                        <a className="course-item__link course-item__link_continue" href="#">Продолжить программу</a>
                                    </div>
                                    <div className="course-item__bottom">
                                        <div className="course-item__status">
                                            <svg className="course-item__info-icon">
                                                <use href="img/sprite.svg#info" />
                                            </svg>
                                            <span className="course-item__info-text">Программа началась:</span>
                                        </div>
                                        <div className="course-item__date">19 мая</div>
                                    </div>
                                </article>
                            </div>
                            <div>
                                <article className="course-item">
                                    <div className="course-item__main">
                                        <div className="course-item__main-top">
                                            <img className="course-item__pic" src="../img/course.svg" alt="" />
                                            <h3 className="course-item__title">
                                                Название программы, курса, при увеличении длины названия увеличивается высота блока
                                            </h3>
                                            <div className="course-item__addition">
                                                дополнение, уточнение
                                            </div>
                                        </div>
                                        <a className="course-item__link course-item__link_start" href="#">Начать программу</a>
                                    </div>
                                    <div className="course-item__bottom">
                                        <div className="course-item__status">
                                            <svg className="course-item__info-icon">
                                                <use href="img/sprite.svg#info" />
                                            </svg>
                                            <span className="course-item__info-text">Программа начнется:</span>
                                        </div>
                                        <div className="course-item__date">21 ноября</div>
                                    </div>
                                </article>
                            </div>
                            <div>
                                <article className="course-item">
                                    <div className="course-item__main">
                                        <div className="course-item__main-top">
                                            <img className="course-item__pic" src="../img/course.svg" alt="" />
                                            <h3 className="course-item__title">
                                                Название программы; КАПС указывается<br />
                                                не в стилях, а в тексте
                                            </h3>
                                            <div className="course-item__addition">
                                                дополнение, уточнение
                                            </div>
                                        </div>
                                        <div className="course-item__link course-item__link_ended" href="#">Программа завершена</div>
                                    </div>
                                    <div className="course-item__bottom">
                                        <div className="course-item__status">
                                            <svg className="course-item__info-icon">
                                                <use href="img/sprite.svg#info" />
                                            </svg>
                                            <span className="course-item__info-text">Программа завершена:</span>
                                        </div>
                                        <div className="course-item__date">01 апреля</div>
                                    </div>
                                </article>
                            </div> */}
                        </div>
                    </div>
                    {/* <button onClick={() => {
                        this.props.dispatch(actions.authLogout())
                    }}>Logout</button> */}
                </main>
            </Fragment>
        )
    }
}

export default Page