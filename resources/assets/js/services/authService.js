import Http from '../Http'
import * as action from '../store/actions/auth'

export function login(credentials) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post('/api/auth/login', credentials)
                .then(res => {
                    dispatch(action.authLogin(res.data))
                    return resolve()
                })
                .catch(response => {
                    const statusCode = response.response.status
                    const data = {
                        errors: response.response.data.errors || {},
                        statusCode,
                    }
                    return reject(data)
                })
        })
    )
}

export function resetPassword(credentials) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post('/api/password/email', credentials)
                .then(response => {
                    return resolve(response.data)
                })
                .catch(response => {
                    const statusCode = response.response.status
                    const data = {
                        errors: response.response.data.errors || {},
                        statusCode,
                    }
                    return reject(data)
                })
        })
    )
}

export function updatePassword(credentials) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post('/api/password/reset', credentials)
                .then(response => {
                    return resolve(response.data)
                })
                .catch(response => {
                    const statusCode = response.response.status
                    const data = {
                        errors: response.response.data.errors || {},
                        statusCode,
                    }
                    return reject(data)
                })
        })
    )
}

export function register(credentials) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post('/api/auth/register', credentials)
                .then(res => {
                    return resolve(res.data)
                })
                .catch(response => {
                    const statusCode = response.response.status
                    const data = {
                        errors: response.response.data.errors || {},
                        statusCode,
                    }
                    return reject(data)
                })
        })
    )
}