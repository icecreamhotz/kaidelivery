import api from '../api'
import {
    userLoggedIn
} from './auth'
import {
    UPDATE_USER_DATA
} from '../types'

export const updateDatafun = status => ({
    type: UPDATE_USER_DATA,
    status
})

export const updateData = status => dispatch =>
    dispatch(updateDatafun(status))

export const signup = data => dispatch =>
    api.user.signup(data).then(user => {
        localStorage.token = user.token
        dispatch(userLoggedIn(user))
    })

export const loginFacebook = data => dispatch =>
    api.user.loginFacebook(data).then(user => {
        localStorage.token = user.token
        dispatch(userLoggedIn(user))
    })