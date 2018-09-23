import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import Breadcrumbs from '../../components/Breadcrumbs'
import Head from "../../components/Head"

const Module = ({ program, module }) => {
    if (module.fetching || !program.data || !module.data)
        return <div className="preloader preloader_absolute" />

    if (module.error)
        return <h1 dangerouslySetInnerHTML={{__html:module.error}} />

    return (
        <Fragment>
            <Breadcrumbs
                items={[{
                    uri: `/programs/${program.data.id}`,
                    title: program.data.name
                }, {
                    title: module.data.name
                }]}
            />

            <Head title={`${module.data.name}`} />

            <h1 className="subsection__page-title page-title">
                <svg className="page-title__icon page-title__icon_subsection">
                    <use href="#doc" />
                </svg>
                {module.data.name}
            </h1>

            <div
                className="content"
                dangerouslySetInnerHTML={{__html:module.data.content}}
            />

            {module.data.opened && (
                <div className="subsection__link-btn">
                    {module.data.nextTask && (
                        <Link
                            to={`/programs/${program.data.id}/${module.data.id}/${module.data.nextTask}`}
                            className="link-btn"
                        >Приступить к просмотру и выполнению уроков</Link>
                    )}
                    {/* {!Boolean(module.data.tasks.length) && (
                        <Link
                            to={`/programs/${program.data.id}/${module.data.id}/${module.data.nextTask}`}
                            className="link-btn"
                        >Приступить к просмотру и выполнению уроков</Link>
                    )} */}
                </div>
            )}

            {Boolean(module.data.tasks.length) && (
                <div className="subsection__lessons lessons">
                    <div className="lessons__heading">
                        <div className="lessons__title">
                            <svg className="lessons__title-icon">
                                <use href="#doc" />
                            </svg>
                            Уроки модуля
                        </div>
                        <div className="lessons__legend">
                            <div className="lessons__legend-item">
                                <span className="lessons__legend-indicator indicator indicator_isDone" />
                                Выполнен
                            </div>
                            <div className="lessons__legend-item">
                                <span className="lessons__legend-indicator indicator indicator_isDuring" />
                                Выполняется
                            </div>
                            <div className="lessons__legend-item">
                                <span className="lessons__legend-indicator indicator indicator_isNotDone" />
                                Не выполнен
                            </div>
                        </div>
                    </div>
                    <ul className="lessons__list">
                        {module.data.tasks.map(row => (
                            <li key={row.id}>
                                <Link
                                    to={`/programs/${program.data.id}/${module.data.id}/${row.id}`}
                                    className="lessons__item"
                                >
                                <span className={classNames('lessons__item-indicator indicator', {
                                    'indicator_isDone': row.status === 1,
                                    'indicator_isDuring': row.status === 2,
                                    'indicator_isNotDone': row.status === 0
                                })} />
                                    <span
                                        className="lessons__item-title"
                                        dangerouslySetInnerHTML={{__html:row.name}}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {module.data.nextModule && (
                <div className="training-nav">
                    <div className="training-nav__rightside">
                        <Link
                            to={`/programs/${program.data.id}/${module.data.nextModule}`}
                            className="function-btn"
                        >Следующий модуль</Link>
                    </div>
                </div>
            )}
        </Fragment>
    )
}

const mapStateToProps = store => ({
    module: store.module,
    program: store.program
})

export default connect(mapStateToProps)(Module)