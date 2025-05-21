import axios, { AxiosError } from "axios"
import router from "@/router"

interface State {
    login: string,
    password: string
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
    async loginAction({commit}: any, payload: {login: string, password: string}){
        try{
            console.log(payload.login,'+', payload.password)
            const apiRequest = 'http://localhost:8000/api/login?email='+payload.login+"&login="+payload.password
            const { data } = await axios.post(apiRequest)
            // const { data } = await axios.post(apiRequest, {
            //     email: payload.login,
            //     password: payload.password
            // })
            window.alert(`login successfull: ${payload.login}\npassword: ${payload.password}\n${data}`)
        }
        catch(e){
            const error = e as AxiosError
            if(error.response){
                const code = error.code
                const message = error.message
                window.alert(`Login error ${code}, ${message}`)
            }
            else if(error.request){
                window.alert(`Unable to send login request`)
            }
        }
    },
    logoutAction({commit}: any){
        commit('setToken', '')
        localStorage.setItem('token', '')
        commit('setUsername', '')
        localStorage.setItem('username', '')
        commit('setUserRole', '')
        localStorage.setItem('role', ''),
        router.push('/login')
    }
}

export default { mutations, getters, state, actions }