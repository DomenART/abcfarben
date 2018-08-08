import * as ActionTypes from '../action-types'
import Http from "../../Http"

export function loadStats() {

    return (dispatch) => {
        Http.get(`/api/curator/stats`)
            .then(response => {
                dispatch({
                    type: ActionTypes.CURATOR_LOAD_STATS,
                    payload: response.data
                })
            })
    }

}