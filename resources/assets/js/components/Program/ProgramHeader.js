import React, { Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import SvgIcon from '../../components/UI/SvgIcon'

const ProgramHeader = ({ name, annotation, hasAccess, match }) =>
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
        {/* <div className="program-header__center">
            {hasAccess && (
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
        </div> */}
        <div className="program-header__rightside">
            {hasAccess && (
                <ul className="program-header__menu">
                    <li><Link to={`/programs/${match.params.program}`}>Структура программы</Link></li>
                    <li><Link to={`/programs/${match.params.program}/wiki`}>Wiki</Link></li>
                    <li><Link to={`/programs/${match.params.program}/tasks`}>Задания</Link></li>
                    <li><Link to={`/programs/${match.params.program}/members`}>Участники</Link></li>
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