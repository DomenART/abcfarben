import * as ActionTypes from '../action-types'
import Http from "../../Http"

export function loadProgram(program) {

    return (dispatch) => {
        dispatch({ type: ActionTypes.GET_PROGRAM_REQUEST })

        Http.get(`/api/programs/${program}`)
            .then(response => {
                dispatch({
                    type: ActionTypes.GET_PROGRAM_SUCCESS,
                    payload: response.data
                })
            })
            .catch(error => {
                dispatch({
                    type: ActionTypes.GET_PROGRAM_FAILURE,
                    payload: error.response.data
                })
            })
    }

}

export function loadTree(program) {

    return (dispatch) => {
        Http.get(`/api/programs/${program}/tree`)
            .then(response => {
                dispatch({
                    type: ActionTypes.PROGRAM_LOAD_TREE,
                    payload: response.data
                })
            })
    }

}