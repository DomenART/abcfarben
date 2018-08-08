import React from 'react'
import classNames from "classnames"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import Breadcrumbs from "../../components/Breadcrumbs"
import SvgIcon from "../../components/UI/SvgIcon"
import * as programActions from '../../store/actions/program'

class Wiki extends React.Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.loadQuestions()
    }

    loadQuestions() {
        const { programActions, program } = this.props

        programActions.loadQuestions(program.data.id)
    }

    render() {
        const { program } = this.props

        return (
            <main className="wiki">
                <Breadcrumbs
                    items={[{
                        uri: `/programs/${program.data.id}`,
                        title: program.data.name
                    }, {
                        title: 'Участники'
                    }]}
                />

                <h1 className="wiki__page-title page-title">
                    <SvgIcon
                        className="page-title__icon page-title__icon_wiki"
                        name="doc"
                    />
                    Wiki
                </h1>

                <div className="uk-position-relative">
                    <ul className="questions">
                        {program.questions && program.questions.map(row => (
                            <li id={`questions-${row.id}`} className="questions-item" key={row.id}>
                                <div
                                    className="questions-item__headline"
                                    data-uk-toggle={`target: #questions-${row.id}; cls: questions-item_isOpened`}
                                >
                                    <span className="questions-item__pic">
                                        <SvgIcon
                                            className="questions-item__icon"
                                            name="folder"
                                        />
                                    </span>
                                    <span
                                        className="questions-item__title"
                                        dangerouslySetInnerHTML={{__html:row.question}}
                                    />

                                    <button
                                        className="questions-item__control"
                                        type="button"
                                    />
                                </div>

                                <div
                                    dangerouslySetInnerHTML={{__html:row.answer}}
                                    className="questions-item__text"
                                />
                            </li>
                        ))}
                    </ul>

                    {program.membersFetching && <div className="preloader preloader_absolute" />}
                </div>
            </main>
        )
    }
}

const mapStateToProps = store => ({
    program: store.program
})

const mapDispatchToProps = dispatch => ({
    programActions: bindActionCreators(programActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Wiki)