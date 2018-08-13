import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { NavLink as Link } from 'react-router-dom'
import Breadcrumbs from '../../components/Breadcrumbs'
import Dialog from '../../components/Dialog'
import SvgIcon from '../../components/UI/SvgIcon'
import Head from "../../components/Head"

const Expert = ({ program }) => {
    return (
        <Fragment>
            <Breadcrumbs
                items={[{
                    uri: `/programs/${program.data.id}`,
                    title: program.data.name
                },  {
                    title: 'Задать вопрос эксперту'
                }]}
            />

            <Head title={`Задать вопрос эксперту`} />

            <h1 className="expert__page-title page-title">
                <SvgIcon
                    name="bubbles"
                    className="page-title__icon page-title__icon_expert"
                />
                Задать вопрос эксперту
            </h1>

            <div className="expert__ad ad">
                {program.data.dialog_title && (
                    <div
                        className="ad__heading"
                        dangerouslySetInnerHTML={{__html:program.data.dialog_title}}
                    />
                )}
                {program.data.dialog_content && (
                    <div
                        className="ad__text"
                        dangerouslySetInnerHTML={{__html:program.data.dialog_content}}
                    />
                )}
                {/* <div className="ad__addiction" /> */}
            </div>

            <Dialog
                title="Вопросы участников к ближайшей сессии “Вопрос-ответ”:"
                thread={program.thread}
            />
        </Fragment>
    )
}

const mapStateToProps = store => ({
    program: store.program
})

export default connect(mapStateToProps)(Expert)