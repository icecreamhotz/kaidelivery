import {
    UPDATE_USER_DATA,
    UPDATE_RESTAURANT_NAME
} from '../types'

export default function update(state = {}, action = {}) {
    switch (action.type) {
        case UPDATE_USER_DATA:
            return {
                userStatus: action.status
            }
        case UPDATE_RESTAURANT_NAME:
            return {
                resStatus: action.status
            }
        default:
            return state
    }
}