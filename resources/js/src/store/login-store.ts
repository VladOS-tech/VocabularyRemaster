import axios, { AxiosError } from "axios"
import router from "@/router"

interface State {
    login: string,
    password: string
}

type loginResponse = {
    message: string,
    user_id: string,
    role: string,
    token: string
}

const state: State = {
    login: '',
    password: ''
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
    async loginAction({commit}: any, payload: {login: string, password: string}): Promise<string>{
        try{
            console.log(payload.login,'+', payload.password)
            const apiRequest = 'http://localhost:8000/api/login'
            // const { data } = await axios.post(apiRequest)
            const { data } = await axios.post<loginResponse>(apiRequest, {
                email: payload.login,
                password: payload.password
            })
            // window.alert(`login successfull: ${data.token}`)
            commit('user/setToken', data.token, { root: true })
            commit('user/setUsername', data.user_id, { root: true })
            commit('user/setUserRole', data.role, { root: true })
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', data.user_id)
            localStorage.setItem('role', data.role)
            if(data.role === 'moderator'){
                await router.push('/moderator')
            }else{
                await router.push('/admin')
            }
        }
        catch(e){
            const error = e as AxiosError
            if(error.response){
                const code = error.code
                // window.alert(code)
                // const message = error.message
                if(code && code === 'ERR_BAD_RESPONSE'){
                    return 'Неверные данные'
                }
            }
            else if(error.request){
                window.alert(`Unable to send login request`)
            }
        }
        return 'success'
    },
    logoutAction({commit}: any){
        commit('user/setToken', '', { root: true })
        commit('user/setUsername', '', { root: true })
        commit('user/setUserRole', '', { root: true })
        localStorage.setItem('token', '')
        localStorage.setItem('username', '')
        localStorage.setItem('role', ''),
        router.push('/login')
    }
}

export default { mutations, getters, state, actions }