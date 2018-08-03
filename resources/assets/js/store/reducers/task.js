import * as ActionTypes from '../action-types'

const initialState = {
    fetching: false,
    error: false,
    data: null,
    nextLesson: null,
    dialog: null,
}

export default (state = initialState, action) => {

    switch (action.type) {

        case ActionTypes.GET_TASK_REQUEST:
            return {
                ...state,
                fetching: true,
                error: false,
            }

        case ActionTypes.GET_TASK_SUCCESS:
            return {
                ...state,
                ...action.payload,
                fetching: false,
                error: false,
            }

        case ActionTypes.GET_TASK_FAILURE:
            return {
                ...state,
                ...action.payload,
                fetching: false,
            }

        case ActionTypes.TASK_CLEAR_NEXT_LESSON:
            return {
                ...state,
                nextLesson: null,
            }

        case ActionTypes.TASK_READ_REQUEST:
            return {
                ...state,
                fetching: true,
            }

        case ActionTypes.TASK_READ_SUCCESS:
            return {
                ...state,
                ...action.payload,
                fetching: false,
            }

        default:
            return state
    }

}