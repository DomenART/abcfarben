import React from 'react'
import classNames from "classnames"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import Breadcrumbs from "../../components/Breadcrumbs"
import SvgIcon from "../../components/UI/SvgIcon"
import ProgramProgress from '../../components/Program/ProgramProgress'
import * as programActions from '../../store/actions/program'

class Members extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: ''
        }

        this.handlerSearch = this.handlerSearch.bind(this)
        this.loadMembers = this.loadMembers.bind(this)
        this.handlerSubmit = this.handlerSubmit.bind(this)
    }

    componentDidMount() {
        this.loadMembers()
    }

    handlerSearch(event) {
        this.setState({
            search: event.target.value
        })
    }

    handlerSubmit(event) {
        event.preventDefault()

        this.loadMembers()
    }

    loadMembers() {
        const { search } = this.state
        const { programActions, program } = this.props

        programActions.loadMembers(program.data.id, search)
    }

    render() {
        const { program, user } = this.props
        const { search } = this.state

        return (
            <main className="participants">
                <Breadcrumbs
                    items={[{
                        uri: `/programs/${program.data.id}`,
                        title: program.data.name
                    }, {
                        title: 'Участники'
                    }]}
                />

                <div className="participants__heading">
                    <h1 className="participants__page-title page-title">
                        <SvgIcon
                            className="page-title__icon page-title__icon_participants"
                            name="user"
                        />
                        Участники
                    </h1>

                    <form className="search-form" onSubmit={this.handlerSubmit}>
                        <input
                            className="search-form__input uk-search"
                            type="search"
                            title="Поле поиска учстников"
                            placeholder="ПОИСК УЧАСТНИКА"
                            value={search}
                            onChange={this.handlerSearch}
                        />
                        <button className="search-form__submit" type="submit">
                            <SvgIcon
                                className="search-form__submit-icon"
                                name="search"
                            />
                        </button>
                    </form>
                </div>

                <div className="uk-overflow-auto uk-position-relative">
                    <table className="participants-table uk-table">
                        <thead>
                            <tr>
                                <th>
                                    Имя участника
                                </th>
                                <th>
                                    Страна
                                </th>
                                <th>
                                    Город
                                </th>
                                <th>
                                    Сфера деятельности
                                </th>
                                <th>
                                    Подразделение
                                </th>
                                <th>
                                    Должность
                                </th>
                                <th>
                                    Прогресс
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {program.members.map(({
                                id, avatar, city, country, name, positions, progress, sphere, subdivision
                            }) => (
                                <tr key={id} className={classNames({'current':id === user.id})}>
                                    <td>
                                        <Link to={`/users/${id}`}>
                                            <img className="participants-table__avatar" src={avatar} alt="" />
                                            {name}
                                        </Link>
                                    </td>
                                    <td>{country}</td>
                                    <td>{city}</td>
                                    <td>{sphere}</td>
                                    <td>{subdivision}</td>
                                    <td>{positions.join(', ')}</td>
                                    <td>
                                        <ProgramProgress {...progress} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {program.membersFetching && <div className="preloader preloader_absolute" />}
                </div>
            </main>
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

export default connect(mapStateToProps, mapDispatchToProps)(Members)