import * as ActionTypes from '../action-types'

const initialState = {
    fetching: false,
    error: false,
    data: null
}

export default (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.GET_MODULE_REQUEST:
            return {
                ...state,
                fetching: true,
                error: false,
                data: {}
            }

        case ActionTypes.GET_MODULE_SUCCESS:
            return {
                ...state,
                fetching: false,
                error: false,
                data: action.payload
            }

        case ActionTypes.GET_MODULE_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.payload,
                data: {}
            }

        default:
            return state
    }

}