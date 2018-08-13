import * as ActionTypes from '../action-types'
import Http from "../../Http"

// export function loadUser(id) {
//     return (dispatch) => {
//         Http.get(`/api/users/${id}`)
//             .then(response => {
//                 dispatch({
//                     type: ActionTypes.AUTH_LOAD_USER,
//                     payload: response.data
//                 })
//             })
//     }
// }

export function updateUser(payload) {
    return {
        type: ActionTypes.AUTH_UPDATE_USER,
        payload
    }
}

export function authLogin(payload){
    return {
        type: ActionTypes.AUTH_LOGIN,
        payload
    }
}

export function authLogout(){
    return {
        type: ActionTypes.AUTH_LOGOUT
    }
}

export function authCheck(){
    return {
        type: ActionTypes.AUTH_CHECK
    }
}

export function loadNotifications() {
    return (dispatch) => {
        Http.get(`/api/notifications`).then(response => {
            dispatch({
                type: ActionTypes.AUTH_LOAD_NOTIFICATIONS,
                payload: response.data
            })
        })
    }
}

export function deleteNotification(id) {
    return (dispatch) => {
        Http.delete(`/api/notifications/${id}`).then(response => {
            dispatch({
                type: ActionTypes.AUTH_LOAD_NOTIFICATIONS,
                payload: response.data
            })
        })
    }
}