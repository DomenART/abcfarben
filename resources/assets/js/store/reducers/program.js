import * as ActionTypes from '../action-types'

const initialState = {
    fetching: false,
    error: false,
    data: null,
    modules: []
}

export default (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.GET_PROGRAM_REQUEST:
            return {...state, fetching: true}

        case ActionTypes.GET_PROGRAM_SUCCESS:
            return {
                ...state,
                ...action.payload,
                error: false,
                fetching: false
            }

        case ActionTypes.GET_PROGRAM_FAILURE:
            return {
                ...state,
                error: action.payload,
                data: {},
                fetching: false
            }

        case ActionTypes.PROGRAM_LOAD_TREE:
            return {
                ...state,
                modules: action.payload,
            }

        default:
            return state
    }

}