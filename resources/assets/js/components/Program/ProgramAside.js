import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { NavLink as Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import romanize from "romanize"
import classNames from "classnames"
import SvgIcon from '../../components/UI/SvgIcon'

const ProgramAside = ({ program }) => {
    const getStatusIcon = code => {
        switch (code) {
            case 1: return 'doc-done'
            case 2: return 'doc-warning'
            default: return 'doc'
        }
    }

    return (
        <div className="menubar" id="menubar">
            <button className="menubar__close-btn uk-offcanvas-close" type="button" data-uk-close />
            <aside className="main-aside">
                <div className="main-aside__section">
                    <div className="main-aside__structure-heading">
                        <img className="main-aside__section-pic" src="/img/structure.svg" alt="" />
                        <span className="main-aside__section-title">Структура программы</span>
                    </div>
                    <ul className="main-aside__structure-list">
                        {program.modules && program.modules.map((item, i) => (
                            <li key={item.id}>
                                <Link
                                    id={`structure-${i}`}
                                    to={`/programs/${program.data.id}/${item.id}`}
                                    className={classNames("main-aside__structure", {
                                        "main-aside__structure_close": !item.opened
                                    })}
                                    activeClassName="main-aside__structure_active main-aside__structure_open"
                                >
                                    <SvgIcon
                                        name={item.opened ? "folder" : "folder-locked"}
                                        className="main-aside__structure-icon"
                                    />
                                    <span className="main-aside__structure-title">
                                        {romanize(i+1)}. {item.name}
                                    </span>
                                </Link>
                                {item.tasks.length && (
                                    <Fragment>
                                        <button
                                            className="main-aside__structure-dropdown"
                                            type="button"
                                            data-uk-toggle={`target: #structure-${i}; cls: main-aside__structure_open`}
                                        />
                                        <ul className="main-aside__substructure-list">
                                            {item.tasks.map(task => (
                                                <li key={task.id}>
                                                    <Link
                                                        to={`/programs/${program.data.id}/${item.id}/${task.id}`}
                                                        className="main-aside__substructure"
                                                        activeClassName="main-aside__substructure_active"
                                                    >
                                                        <SvgIcon
                                                            name={getStatusIcon(task.status)}
                                                            className="main-aside__substructure-icon"
                                                        />
                                                        {task.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </Fragment>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* <div className="main-aside__section">
                    <button className="main-aside__link calendar-btn" type="button" data-uk-toggle="target: #aside-calendar">
                        <SvgIcon name="calendar" className="calendar-btn__icon" />
                        <span className="calendar-btn__title">Календарь</span>
                    </button>
                    <div className="calendar" id="aside-calendar" hidden>
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
                </div> */}
                <div className="main-aside__section">
                    <Link
                        to={`/programs/${program.data.id}/expert`}
                        className="main-aside__link"
                    >
                        <SvgIcon name="bubbles" className="main-aside__icon main-aside__icon_expert" />
                        <span className="main-aside__link-title">Задать вопрос эксперту</span>
                    </Link>
                </div>
                {program.curator && (
                    <div className="main-aside__section">
                        <Link to={`/users/${program.curator}`} className="main-aside__link">
                            <SvgIcon name="curator" className="main-aside__icon main-aside__icon_curator" />
                            <span className="main-aside__link-title">Мой куратор</span>
                        </Link>
                    </div>
                )}
            </aside>
        </div>
    )
}

const mapStateToProps = store => ({
    program: store.program
})

export default withRouter(connect(mapStateToProps)(ProgramAside))