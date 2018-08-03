import React, {Component, Fragment} from 'react'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as programActions from '../store/actions/program'
import Http from '../Http'
import SvgSprite from '../components/UI/SvgSprite'
import SvgIcon from '../components/UI/SvgIcon'

class Layout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            program: {
                name: null,
                hasAccess: null
            }
        }
    }

    componentDidMount() {
        const { program_id, program, programActions } = this.props

            programActions.loadProgram(program_id)
        // console.log(this.props)
        // Http.get(`/api/programs/${this.props.program}`).then(response => {
        //     this.setState({
        //         program: response.data.data,
        //         loading: false
        //     })
        // })
    }

    render() {
        const { children, user } = this.props
        const { program, loading } = this.state

        return (
            <Fragment>
                {loading && (<div className="preloader" />)}

                <main className="page">
                    <header className="main-header">
                        <div className="main-header__leftside">
                            <Link to="/" className="main-header__logo">
                                <img className="main-header__logo-img" src="/img/logo.png" alt="" />
                                <div className="main-header__logo-title">
                                    Электронная Академия<br />
                                    ABC Farben
                                </div>
                            </Link>
                        </div>
                        <div className="main-header__rightside">
                            <div>
                                <Link to="/" className="main-header__programs">« Список учебных программ</Link>
                                <button className="main-header__help" type="button" data-uk-toggle="target: #help">
                                    <SvgIcon name="help" className="main-header__help-icon" />
                                </button>
                                <div id="help" data-uk-modal>
                                    <div className="help uk-modal-dialog uk-modal-body">
                                        <button className="help__close uk-modal-close" type="button" data-uk-close />
                                        <ul className="help__nav" data-uk-switcher="connect: .help__content;">
                                            <li><a href="#"></a></li>
                                            <li><a href="#"></a></li>
                                            <li><a href="#"></a></li>
                                        </ul>
                                        <ul className="uk-switcher help__content">
                                            <li>
                                                <div className="help__image-area">
                                                    <img className="help__image" src="../img/help-image.jpg" alt="" />
                                                </div>
                                                <div className="help__desc-area">
                                                    <div className="help__desc-title">
                                                        Шаг 6 - Вопросы эксперту
                                                    </div>
                                                    <div className="help__desc-text">
                                                        Вы можете задать вопрос эксперту на открытой сессии “вопрос-ответ”
                                                        в соответствующем разделе.
                                                    </div>
                                                    <button className="help__desc-further" type="button">Дальше</button>
                                                    <button className="help__desc-end uk-modal-close" type="button">Мне всё понятно</button>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="help__image-area">
                                                    <img className="help__image" src="../img/help-image.jpg" alt="" />
                                                </div>
                                                <div className="help__desc-area">
                                                    <div className="help__desc-title">
                                                        Шаг 3 - Помощь эксперту
                                                    </div>
                                                    <div className="help__desc-text">
                                                        Вы можете задать вопрос эксперту на открытой сессии “вопрос-ответ”
                                                        в соответствующем разделе.
                                                    </div>
                                                    <button className="help__desc-further" type="button">Дальше</button>
                                                    <button className="help__desc-end uk-modal-close" type="button">Мне всё понятно</button>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="help__image-area">
                                                    <img className="help__image" src="../img/help-image.jpg" alt="" />
                                                </div>
                                                <div className="help__desc-area">
                                                    <div className="help__desc-title">
                                                        Шаг 1 - Помощь мне
                                                    </div>
                                                    <div className="help__desc-text">
                                                        Вы можете задать вопрос эксперту на открытой сессии “вопрос-ответ”
                                                        в соответствующем разделе.
                                                    </div>
                                                    <button className="help__desc-further" type="button">Дальше</button>
                                                    <button className="help__desc-end uk-modal-close" type="button">Мне всё понятно</button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <button className="main-header__notification-btn notification-btn" type="button">
                                    <SvgIcon name="bell" className="notification-btn__icon" />
                                    <div className="notification-btn__counter"><span>348</span></div>
                                </button>
                                <div className="notifications" data-uk-dropdown="mode: click; pos: right-top;">
                                    <div className="notifications__inner">
                                        <div className="notification-item">
                                            <div className="notification-item__title">
                                                Программа, к которой относится уведомление
                                            </div>
                                            <div className="notification-item__info">
                                                <a className="notification-item__link" href="#">
                                                    <span className="notification-item__calendar">
                                                        <SvgIcon name="calendar" className="notification-item__calendar-icon" />
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
                                                        <SvgIcon name="folder" className="notification-item__folder-icon" />
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
                                                        <SvgIcon name="folder" className="notification-item__folder-icon" />
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
                            <div>
                                <a className="main-header__user" href="#">
                                    {user.name}
                                    <img className="main-header__user-avatar" src={user.avatar} alt="" />
                                </a>
                            </div>
                        </div>
                    </header>

                    <header className="program-header">
                        <div className="program-header__leftside">
                            <div className="program-header__title">
                                <img className="program-header__title-pic" src="../img/course.svg" alt="" />
                                <div
                                    className="program-header__title-text"
                                    dangerouslySetInnerHTML={{__html: program.name}}
                                />
                            </div>
                            <div
                                className="program-header__addition"
                                dangerouslySetInnerHTML={{__html: program.annotation}}
                            />
                        </div>
                        <div className="program-header__center">
                            {program.hasAccess && (
                                <div className="progress">
                                    <div className="progress__text">прогресс на программе</div>
                                    <div className="progress__scale">
                                        <div className="progress__done" />
                                        <div className="progress__available" />
                                    </div>
                                    <div className="progress__numbers">
                                        <div className="progress__level progress__level_done">20%</div>
                                        <div className="progress__level progress__level_available">35%</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="program-header__rightside">
                            {program.hasAccess && (
                                <ul className="program-header__menu">
                                    <li><Link to="/programs/1">Структура программы</Link></li>
                                    <li><Link to="/programs/1/wiki">Wiki</Link></li>
                                    <li><a href="#">Задания</a></li>
                                    <li><a href="#">Участники</a></li>
                                    <li>
                                        <a className="program-header__fb" href="#">
                                            <SvgIcon name="fb" className="program-header__fb-icon" />
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </header>

                    {program.hasAccess ? (
                        <div className="uk-grid">
                            <div className="menubar" id="menubar">
                                <button className="menubar__close-btn uk-offcanvas-close" type="button" data-uk-close />
                                <aside className="main-aside">
                                    <div className="main-aside__section">
                                        <div className="main-aside__structure-heading">
                                            <img className="main-aside__section-pic" src="../img/structure.svg" alt="" />
                                            <span className="main-aside__section-title">Структура программы</span>
                                        </div>
                                        <ul className="main-aside__structure-list">
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isAvailable" href="#">
                                                    <SvgIcon name="folder" className="main-aside__structure-icon" />
                                                    <span className="main-aside__structure-title">I. Модель системного развития lorem ipsum</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isAvailable" href="#">
                                                    <SvgIcon name="folder" className="main-aside__structure-icon" />
                                                    <span className="main-aside__structure-title">II. Модель системного мышления</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" data-uk-toggle="target: #substructure-2" />
                                                <ul className="main-aside__substructure-list" id="substructure-2">
                                                    <li>
                                                        <a className="main-aside__substructure" href="#">
                                                            <SvgIcon name="doc-done" className="main-aside__substructure-icon-done" />
                                                            <span className="main-aside__substructure-title">
                                                                Модель системного бизнеса
                                                            </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="main-aside__substructure" href="#">
                                                            <SvgIcon name="doc" className="main-aside__substructure-icon" />
                                                            <span className="main-aside__substructure-title">
                                                                Модель системного бизнеса
                                                            </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="main-aside__substructure" href="#">
                                                            <SvgIcon name="doc" className="main-aside__substructure-icon" />
                                                            <span className="main-aside__substructure-title">
                                                                Модель системного бизнеса
                                                            </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="main-aside__substructure" href="#">
                                                            <SvgIcon name="doc" className="main-aside__substructure-icon" />
                                                            <span className="main-aside__substructure-title">
                                                                Модель системного бизнеса
                                                            </span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isAvailable" href="#">
                                                    <SvgIcon name="folder" className="main-aside__structure-icon" />
                                                    <span className="main-aside__structure-title">III. Организационная с ...</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isAvailable" href="#">
                                                    <SvgIcon name="folder" className="main-aside__structure-icon" />
                                                    <span className="main-aside__structure-title">IV. Модель системного ...</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isAvailable" href="#">
                                                    <SvgIcon name="folder" className="main-aside__structure-icon" />
                                                    <span className="main-aside__structure-title">V. Модель системного ...</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isAvailable" href="#">
                                                    <SvgIcon name="folder" className="main-aside__structure-icon" />
                                                    <span className="main-aside__structure-title">VI. Модель системного ...</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isAvailable" href="#">
                                                    <SvgIcon name="folder" className="main-aside__structure-icon" />
                                                    <span className="main-aside__structure-title">VII. Модель системного ...</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isAvailable" href="#">
                                                    <SvgIcon name="folder" className="main-aside__structure-icon" />
                                                    <span className="main-aside__structure-title">VIII. Модель системного ...</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isAvailable" href="#">
                                                    <SvgIcon name="folder" className="main-aside__structure-icon" />
                                                    <span className="main-aside__structure-title">IX. Модель системного ...</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isLocked" href="#">
                                                    <SvgIcon name="folder-locked" className="main-aside__structure-icon-locked" />
                                                    <span className="main-aside__structure-title">X. Модель системного ...</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isLocked" href="#">
                                                    <SvgIcon name="folder-locked" className="main-aside__structure-icon-locked" />
                                                    <span className="main-aside__structure-title">XI. Модель системного ...</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isLocked" href="#">
                                                    <SvgIcon name="folder-locked" className="main-aside__structure-icon-locked" />
                                                    <span className="main-aside__structure-title">XII. Модель системного ...</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                            <li>
                                                <a className="main-aside__structure main-aside__structure_isLocked" href="#">
                                                    <SvgIcon name="folder-locked" className="main-aside__structure-icon-locked" />
                                                    <span className="main-aside__structure-title">XII. Модель системного ...</span>
                                                </a>
                                                <button className="main-aside__structure-dropdown" type="button" />
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="main-aside__section">
                                        <button className="main-aside__link calendar-btn" type="button" data-uk-toggle="target: #calendar">
                                            <SvgIcon name="calendar" className="calendar-btn__icon" />
                                            <span className="calendar-btn__title">Календарь</span>
                                        </button>
                                        <div className="calendar" id="calendar" hidden>
                                            <div className="calendar__control">
                                                <button className="calendar__control-prev" type="button" />
                                                <div className="calendar__control-month">Май</div>
                                                <button className="calendar__control-next" type="button" />
                                            </div>
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <th>ПН</th>
                                                    <th>ВТ</th>
                                                    <th>СР</th>
                                                    <th>ЧТ</th>
                                                    <th>ПТ</th>
                                                    <th>СБ</th>
                                                    <th>ВС</th>
                                                </tr>
                                                <tr>
                                                    <td className="calendar__outside-cell">30</td>
                                                    <td>1</td>
                                                    <td><button className="event-btn event-btn_haveEvent" data-uk-toggle="target: #event">2</button></td>
                                                    <td>3</td>
                                                    <td>4</td>
                                                    <td>5</td>
                                                    <td>6</td>
                                                </tr>
                                                <tr>
                                                    <td>7</td>
                                                    <td>8</td>
                                                    <td>9</td>
                                                    <td><button className="event-btn event-btn_haveEvent">10</button></td>
                                                    <td>1</td>
                                                    <td>12</td>
                                                    <td>13</td>
                                                </tr>
                                                <tr>
                                                    <td>14</td>
                                                    <td>15</td>
                                                    <td>16</td>
                                                    <td>17</td>
                                                    <td>18</td>
                                                    <td>19</td>
                                                    <td>20</td>
                                                </tr>
                                                <tr>
                                                    <td>21</td>
                                                    <td>22</td>
                                                    <td><button className="event-btn event-btn_haveEvent">23</button></td>
                                                    <td>24</td>
                                                    <td>25</td>
                                                    <td>26</td>
                                                    <td>27</td>
                                                </tr>
                                                <tr>
                                                    <td>28</td>
                                                    <td>29</td>
                                                    <td>30</td>
                                                    <td className="calendar__outside-cell">1</td>
                                                    <td className="calendar__outside-cell">2</td>
                                                    <td className="calendar__outside-cell">3</td>
                                                    <td className="calendar__outside-cell">4</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <div id="event" data-uk-modal>
                                                <div className="event uk-modal-dialog uk-modal-body">
                                                    <button className="close uk-modal-close" type="button" data-uk-close />
                                                    <div className="event__heading">
                                                        <SvgIcon name="folder" className="event__heading-icon" />
                                                        <h3 className="event__heading-desc">Открытие модуля  17 июня в 09:00</h3>
                                                    </div>
                                                    <h3 className="event__title">V. Название модуля, может быть длинным</h3>
                                                    <div className="event__text">
                                                        Небольшой текстовый блок, поясняющий подробнее, какое именно событие, что будет, кому подойдет и тд.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="main-aside__section">
                                        <a href="#" className="main-aside__link">
                                            <SvgIcon name="bubbles" className="main-aside__icon main-aside__icon_expert" />
                                            <span className="main-aside__link-title">Задать вопрос эксперту</span>
                                        </a>
                                    </div>
                                    <div className="main-aside__section">
                                        <a href="#" className="main-aside__link">
                                            <SvgIcon name="curator" className="main-aside__icon main-aside__icon_curator" />
                                            <span className="main-aside__link-title">Мой куратор</span>
                                        </a>
                                    </div>
                                </aside>
                            </div>
                            <div className="uk-width-expand">
                                <main className="program">
                                    <div className="container">
                                        {children}
                                    </div>
                                </main>
                                <button className="menu-btn" data-uk-icon="icon: menu" type="button" data-uk-toggle="target: #menubar" />
                            </div>
                        </div>
                    ) : !loading && <h3>Доступ запрещен</h3>}

                    <SvgSprite />
                </main>
            </Fragment>
        )
    }
}

const mapStateToProps = store => ({
    user: store.Auth.user,
    program: store.program
})

const mapDispatchToProps = dispatch => ({
    programActions: bindActionCreators(programActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)