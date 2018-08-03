import * as ActionTypes from '../action-types'
import { bindActionCreators } from 'redux'
import { loadTree } from './program'
import Http from "../../Http"

export function loadTask(program, task) {

    return (dispatch) => {
        dispatch({ type: ActionTypes.GET_TASK_REQUEST })

        Http.get(`/api/programs/${program}/tasks/${task}`)
            .then(response => {
                dispatch({
                    type: ActionTypes.GET_TASK_SUCCESS,
                    payload: response.data
                })
                bindActionCreators(loadTree, dispatch)(program)
            })
            .catch(({ response }) => {
                dispatch({
                    type: ActionTypes.GET_TASK_FAILURE,
                    payload: response.data
                })
            })
    }

}

export function clearNextLesson() {

    return {
        type: ActionTypes.TASK_CLEAR_NEXT_LESSON
    }

}

export function readTask(program, task) {

    return (dispatch) => {
        dispatch({ type: ActionTypes.TASK_READ_REQUEST })

        Http.post(`/api/programs/${program}/tasks/${task}/read`)
            .then(response => {
                dispatch({
                    type: ActionTypes.TASK_READ_SUCCESS,
                    payload: response.data
                })
                bindActionCreators(loadTree, dispatch)(program)
            })
    }

}