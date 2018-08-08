import React, {Fragment} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Route } from 'react-router'
import { Link, Switch, Redirect } from 'react-router-dom'
import * as programActions from '../../store/actions/program'
import Wiki from './Wiki'
import Main from './Main'
import Tasks from './Tasks'
import Members from './Members'
import Module from './Module'
import Task from './Task'
import Lesson from './Lesson'
import Expert from './Expert'
import Container from './Container'
import ProgramAside from '../../components/Program/ProgramAside'
import ProgramHeader from '../../components/Program/ProgramHeader'
import HeaderContainer from '../../containers/HeaderContainer'

class Page extends React.Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        const { programActions, match } = this.props

        programActions.loadProgram(match.params.program)
        programActions.loadTree(match.params.program)
    }

    getContent() {
        const { match, program } = this.props

        if (program.fetching || !program.data) {
            return <div className="preloader" />
        }

        if (program.error) {
            return <h1 dangerouslySetInnerHTML={{__html:program.error}} />
        }

        return (
            <Fragment>
                <ProgramHeader
                    {...program.data}
                    progress={program.progress}
                />

                {program.data.hasAccess ? (
                    <div className="uk-grid">
                        <ProgramAside />

                        <div className="uk-width-expand uk-position-relative">
                            <div className="container">
                                <Switch>
                                    <Route path={`${match.url}`} exact component={Main} />
                                    <Route path={`${match.url}/wiki`} exact component={Wiki}/>
                                    <Route path={`${match.url}/tasks`} exact component={Tasks}/>
                                    <Route path={`${match.url}/members`} exact component={Members}/>
                                    <Route path={`${match.url}/expert`} exact component={Expert}/>
                                    <Route path={`${match.url}/:module`} exact render={props => (
                                        <Container
                                            {...props}
                                            component={Module}
                                        />
                                    )} />
                                    <Route path={`${match.url}/:module/:task`} exact render={props => (
                                        <Container
                                            {...props}
                                            component={Task}
                                        />
                                    )} />
                                    <Route path={`${match.url}/:module/:task/:lesson`} exact render={props => (
                                        <Container
                                            {...props}
                                            component={Lesson}
                                        />
                                    )} />
                                    <Route path={`${match.url}/`} render={() => <h1>Нет такой страницы</h1>} />
                                </Switch>
                            </div>
                            <button className="menu-btn" data-uk-icon="icon: menu" type="button" data-uk-toggle="target: #menubar" />
                        </div>
                    </div>
                ) : <h1>У вас нет доступа к данной программе</h1>}
            </Fragment>
        )
    }

    render() {
        const { match } = this.props

        return (
            <main className="page">
                <HeaderContainer />

                {this.getContent()}
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

export default connect(mapStateToProps, mapDispatchToProps)(Page)