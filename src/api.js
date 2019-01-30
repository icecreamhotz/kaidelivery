import API from './helper/api'

export default {
    user: {
        login: async (credentials) =>
            await API.post(`users/login`, credentials).then(res => res.data),
        signup: async (user) =>
            await API.post(`users/signup`, user).then(res => res.data),
        loginFacebook: async (user) =>
            await API.post(`users/auth/facebook`, user).then(res => res.data)
    }
}