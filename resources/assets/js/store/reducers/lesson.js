import * as ActionTypes from '../action-types'

const initialState = {
    readFetching: false,
    fetching: false,
    error: false,
    data: {},
    previous: {},
    next: {},
}

export default (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.GET_LESSON_REQUEST:
            return {
                ...state,
                fetching: true,
                error: false,
            }

        case ActionTypes.GET_LESSON_SUCCESS:
            return {
                ...state,
                ...action.payload,
                fetching: false,
                error: false,
            }

        case ActionTypes.GET_LESSON_FAILURE:
            return {
                ...state,
                ...action.payload,
                fetching: false,
            }

        case ActionTypes.LESSON_READ_REQUEST:
            return {
                ...state,
                readFetching: true,
            }

        case ActionTypes.LESSON_READ_SUCCESS:
            return {
                ...state,
                readFetching: false,
            }

        default:
            return state
    }

}