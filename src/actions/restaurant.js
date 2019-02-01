import {
    UPDATE_RESTAURANT_NAME,
    UPDATE_TRIGGER_MYRESTAURANT
} from '../types'

export const updateRestaurantName = status => dispatch => {
    dispatch({
        type: UPDATE_RESTAURANT_NAME,
        status
    })
}

export const updateTriggerURL = value => dispatch => {
    dispatch({
        type: UPDATE_TRIGGER_MYRESTAURANT,
        value
    })
}