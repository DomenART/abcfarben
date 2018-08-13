import * as ActionTypes from '../action-types'
import Http from '../../Http'

const user = {
    id: null,
    name: null,
    email: null,
    createdAt: null,
    updatedAt: null,
    roles: [],
    notifications: []
}

const initialState = {
    isAuthenticated : false,
    user
}

const Auth = (state= initialState,{type,payload = null}) => {
    switch(type) {
        case ActionTypes.AUTH_LOGIN:
            return authLogin(state,payload)
        case ActionTypes.AUTH_CHECK:
            return checkAuth(state)
        case ActionTypes.AUTH_LOGOUT:
            return logout(state)
        case ActionTypes.AUTH_UPDATE_USER:
            return updateUser(state,payload)
        case ActionTypes.AUTH_LOAD_NOTIFICATIONS:
            return {
                ...state,
                notifications: payload
            }
        default:
            return state
    }
}

const updateUser = (state, payload) => {
    return {
        ...state,
        user: payload
    }
}

const authLogin = (state, payload) => {
    const token = payload.token
    const user = payload.user
    localStorage.setItem('token', token)
    Http.defaults.headers.common['Authorization'] = `Bearer ${token}`
    state = Object.assign({}, state, {
        isAuthenticated: true,
        user
    })
    return state
}

const checkAuth = (state) => {
    state = Object.assign({}, state, {
        isAuthenticated : !!localStorage.getItem('token'),
    })
    if(state.isAuthenticated) {
        Http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }
    return state
}

const logout = (state) => {
    localStorage.removeItem('token')
    state = Object.assign({} ,state, {
        isAuthenticated: false,
        user
    })
    return state
}

export default Auth