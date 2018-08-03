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
import Header from '../../components/Header'

const Content = ({ data, fetching, error, url }) => {
    if (fetching || !data) {
        return <div className="preloader" />
    }

    if (error) {
        return <h1 dangerouslySetInnerHTML={{__html:error}} />
    }

    return (
        <Fragment>
            <ProgramHeader
                name={data.name}
                annotation={data.annotation}
                hasAccess={data.hasAccess}
            />

            {data.hasAccess ? (
                <div className="uk-grid">
                    <ProgramAside />

                    <div className="uk-width-expand uk-position-relative">
                        <div className="container">
                            <Switch>
                                <Route path={`${url}`} exact component={Main} />
                                <Route path={`${url}/wiki`} exact component={Wiki}/>
                                <Route path={`${url}/tasks`} exact component={Tasks}/>
                                <Route path={`${url}/members`} exact component={Members}/>
                                <Route path={`${url}/expert`} exact component={Expert}/>
                                <Route path={`${url}/:module`} exact render={props => (
                                    <Container
                                        {...props}
                                        component={Module}
                                    />
                                )} />
                                <Route path={`${url}/:module/:task`} exact render={props => (
                                    <Container
                                        {...props}
                                        component={Task}
                                    />
                                )} />
                                <Route path={`${url}/:module/:task/:lesson`} exact render={props => (
                                    <Container
                                        {...props}
                                        component={Lesson}
                                    />
                                )} />
                                <Route path={`${url}/`} render={() => <h1>Нет такой страницы</h1>} />
                            </Switch>
                        </div>
                        <button className="menu-btn" data-uk-icon="icon: menu" type="button" data-uk-toggle="target: #menubar" />
                    </div>
                </div>
            ) : <h1>У вас нет доступа к данной программе</h1>}
        </Fragment>
    )
}

class Page extends React.Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        const { programActions, match } = this.props

        programActions.loadProgram(match.params.program)
        programActions.loadTree(match.params.program)
    }

    render() {
        const { match, user } = this.props

        return (
            <main className="page">
                <Header user={user} />

                <Content
                    {...this.props.program}
                    url={match.url}
                />
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