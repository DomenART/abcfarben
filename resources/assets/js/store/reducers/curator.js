import * as ActionTypes from '../action-types'

const initialState = {
    unreadMessages: 0
}

export default (state = initialState, action) => {

    switch (action.type) {

        case ActionTypes.CURATOR_LOAD_STATS:
            return {
                ...state,
                ...action.payload
            }

        default:
            return state
    }

}