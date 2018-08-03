import * as ActionTypes from '../action-types'
import Http from "../../Http"

export function loadLesson(program, lesson) {

    return (dispatch) => {
        dispatch({ type: ActionTypes.GET_LESSON_REQUEST })

        Http.get(`/api/programs/${program}/lessons/${lesson}`)
            .then(response => {
                dispatch({
                    type: ActionTypes.GET_LESSON_SUCCESS,
                    payload: response.data
                })
            })
            .catch(({ response }) => {
                dispatch({
                    type: ActionTypes.GET_LESSON_FAILURE,
                    payload: response.data
                })
            })
    }

}

export function readLesson(program, lesson) {

    return (dispatch) => {
        dispatch({ type: ActionTypes.LESSON_READ_REQUEST })

        Http.post(`/api/programs/${program}/lessons/${lesson}/read`)
            .then(response => {
                dispatch({
                    type: ActionTypes.LESSON_READ_SUCCESS
                })
            })
    }

}