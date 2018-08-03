import * as ActionTypes from '../action-types'
import Http from "../../Http"

export function loadModule(program, module) {

    return (dispatch) => {
        dispatch({ type: ActionTypes.GET_MODULE_REQUEST })

        Http.get(`/api/programs/${program}/modules/${module}`)
            .then(response => {
                dispatch({
                    type: ActionTypes.GET_MODULE_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(error => {
                dispatch({
                    type: ActionTypes.GET_MODULE_FAILURE,
                    payload: error.response.data
                })
            })
    }

}