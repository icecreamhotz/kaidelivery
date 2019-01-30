import {
    UPDATE_RESTAURANT_NAME
} from '../types'

export const updateRestaurantName = status => dispatch => {
    dispatch({
        type: UPDATE_RESTAURANT_NAME,
        status
    })
}