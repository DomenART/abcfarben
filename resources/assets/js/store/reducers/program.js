import * as ActionTypes from '../action-types'

const initialState = {
    fetching: false,
    error: false,
    data: null,
    modules: [],
    members: [],
    membersFetching: false,
    questions: [],
    questionsFetching: false
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

        case ActionTypes.GET_PROGRAM_MEMBERS_REQUEST:
            return {
                ...state,
                membersFetching: true
            }

        case ActionTypes.GET_PROGRAM_MEMBERS_SUCCESS:
            return {
                ...state,
                members: action.payload,
                membersFetching: false
            }

        case ActionTypes.GET_PROGRAM_QUESTIONS_REQUEST:
            return {
                ...state,
                questionsFetching: true
            }

        case ActionTypes.GET_PROGRAM_QUESTIONS_SUCCESS:
            return {
                ...state,
                questions: action.payload,
                questionsFetching: false
            }

        default:
            return state
    }

}