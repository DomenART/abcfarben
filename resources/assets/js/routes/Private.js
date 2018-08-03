import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'

const PrivateRoute = ({ component: Component, roles, user, isAuthenticated, ...rest }) => (
    <Route {...rest} render={props => {
        if (!isAuthenticated) {
            return (
                <Redirect to={{
                    pathname: '/login',
                    state: {from: props.location}
                }} />
            )
        }

        if (roles && roles.length) {
            if (!roles.filter(role => user.roles.filter(({ slug }) => slug === role).length).length) {
                return (
                    <Redirect to={{ pathname: '/' }} />
                )
            }
        }

        return <Component {...props}/>
    }}/>
)

const mapStateToProps = (state) => {
    return {
        isAuthenticated : state.Auth.isAuthenticated,
        user : state.Auth.user,
    }
}

export default connect(mapStateToProps)(PrivateRoute)