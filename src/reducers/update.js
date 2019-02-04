import {
    UPDATE_USER_DATA,
    UPDATE_RESTAURANT_NAME,
    UPDATE_TRIGGER_MYRESTAURANT,
    UPDATE_TRIGGER_RESCOMPONENT,
} from '../types'

export default function update(state = {
    resStep: false,
    resComponent: false,
    urlStatus: false
}, action = {}) {
    switch (action.type) {
        case UPDATE_USER_DATA:
            return {
                userStatus: action.status
            }
        case UPDATE_RESTAURANT_NAME:
            return {
                resStatus: action.status
            }
        case UPDATE_TRIGGER_MYRESTAURANT:
            return {
                resStep: action.value
            }
        case UPDATE_TRIGGER_RESCOMPONENT:
            return {
                resComponent: action.value
            }
        default:
            return state
    }
}