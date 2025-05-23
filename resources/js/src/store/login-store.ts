import axios, { AxiosError } from "axios"
import router from "@/router"

type loginResponse = {
    message: string,
    user_id: string,
    role: string,
    token: string,
    name: string
}


const getters = {
    // login(state: State){
    //     return state.login
    // },
    // password(state: State){
    //     return state.password
    // }
}

const mutations = {
    // setLogin(state: State, newLogin: string){
    //     state.login = newLogin
    // },
    // setPpassword(state: State, newPassword: string){
    //     state.password = newPassword
    // }
}

const actions = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async loginAction({ commit }: any, payload: { login: string, password: string }): Promise<string> {
        try {
            console.log(payload.login, '+', payload.password)
            const apiRequest = 'http://localhost:8000/api/login'
            // const { data } = await axios.post(apiRequest)
            const { data } = await axios.post<loginResponse>(apiRequest, {
                email: payload.login,
                password: payload.password
            })
            // window.alert(`login successfull: ${data.token}`)
            console.log(data)
            commit('setToken', data.token, { root: true })
            commit('setUsername', data.name, { root: true })
            commit('setUserRole', data.role, { root: true })
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', data.name)
            localStorage.setItem('role', data.role)
            if (data.role === 'moderator') {
                await router.push('/moderator')
            } else {
                await router.push('/admin')
            }
        }
        catch (e) {
            const error = e as AxiosError
            if (error.response) {
                const code = error.code
                // window.alert(code)
                // const message = error.message
                if (code && code === 'ERR_BAD_RESPONSE') {
                    return 'Неверные данные'
                }
            }
            else if (error.request) {
                window.alert(`Unable to send login request`)
            }
        }
        return 'success'
    },
    async logoutAction({ commit, rootGetters }: any) {
        const token = rootGetters.token
        // window.alert(token)
        if (localStorage.getItem('token') !== '') try {
            const { data } = await axios.post('http://127.0.0.1:8000/api/logout', {
                headers: {
                    // temporary from localstorage (currently does not work)
                    Authorization: `Bearer ${ token }`
                }
            })
            window.alert(data.message)
        } catch (error) {
            console.error('Ошибка при выходе:', error)
        }
        commit('setToken', '', { root: true })
        commit('setUsername', '', { root: true })
        commit('setUserRole', '', { root: true })
        localStorage.setItem('token', '')
        localStorage.setItem('username', '')
        localStorage.setItem('role', '')
        return await router.push('/login')
    }
}

export default { mutations, getters, actions }