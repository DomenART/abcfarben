import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { NavLink as Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import romanize from "romanize"
import classNames from "classnames"
import SvgIcon from '../../components/UI/SvgIcon'
import Calendar from '../../components/Calendar'

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

                <Calendar />

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