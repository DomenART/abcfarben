import React, { Fragment } from 'react'
import { withRouter } from 'react-router'
import { NavLink as Link } from 'react-router-dom'
import SvgIcon from '../../components/UI/SvgIcon'
import ProgramProgress from '../../components/Program/ProgramProgress'

const ProgramHeader = ({ name, annotation, hasAccess, match, progress }) =>
    <header className="program-header">
        <div className="program-header__leftside">
            <div className="program-header__title">
                <img className="program-header__title-pic" src="/img/course.svg" alt="" />
                <div
                    className="program-header__title-text"
                    dangerouslySetInnerHTML={{__html:name}}
                />
            </div>
            <div
                className="program-header__addition"
                dangerouslySetInnerHTML={{__html:annotation}}
            />
        </div>
        <div className="program-header__center">
            {hasAccess && <ProgramProgress title="прогресс на программе" {...progress} />}
        </div>
        <div className="program-header__rightside">
            {hasAccess && (
                <ul className="program-header__menu">
                    <li>
                        <Link
                            exact={true}
                            to={`/programs/${match.params.program}`}
                            activeClassName="active"
                        >Структура программы</Link>
                    </li>
                    <li>
                        <Link
                            to={`/programs/${match.params.program}/wiki`}
                            activeClassName="active"
                        >Wiki</Link>
                    </li>
                    <li>
                        <Link
                            to={`/programs/${match.params.program}/tasks`}
                            activeClassName="active"
                        >Задания</Link>
                    </li>
                    <li>
                        <Link
                            to={`/programs/${match.params.program}/members`}
                            activeClassName="active"
                        >Участники</Link>
                    </li>
                    <li>
                        <a className="program-header__fb" href="#">
                            <SvgIcon name="fb" className="program-header__fb-icon" />
                        </a>
                    </li>
                </ul>
            )}
        </div>
    </header>

export default withRouter(ProgramHeader)