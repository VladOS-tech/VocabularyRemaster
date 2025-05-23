import PhraseObject from "@/assets/types/PhraseObject"
import StaffObject from "@/assets/types/StaffObject"

import ExampleRequests from '@/assets/JSObjects/ExamplePhrases.json'
import ExampleStaff from '@/assets/JSObjects/ExampleStaff.json'
import axios, { AxiosError } from "axios"
import router from "@/router"

interface State {
    token: string,
    role: string,
    username: string,
    tabName: string,
    requestList: PhraseObject[] | null,
    staffPhraseList: PhraseObject[]  | null,
    staffList: StaffObject[] | null,
    requestLoading: boolean,
    phraseLoading: boolean,
    staffLoading: boolean
}

const state: State = {
    token: '' as string,
    role: 'user' as string,
    username: '' as string,
    tabName: '',
    requestList: null,
    staffPhraseList: [],
    staffList: null,
    requestLoading: true,
    phraseLoading: true,
    staffLoading: true
}

const getters = {
    tabName(state: State){
        return state.tabName
    },
    requestList(state: State) {
        return state.requestList
    },
    staffPhraseList(state: State) {
        return state.staffPhraseList
    },
    staffList(state: State) {
        return state.staffList
    },
    requestLoading(state: State){
        return state.requestLoading
    },
    phraseLoading(state: State){
        return state.phraseLoading
    },
    staffLoading(state: State){
        return state.staffLoading
    },
    role(state: State){
      return state.role
    },
    username(state: State){
      return state.username
    },
    token(state: State){
      return state.token
    }
}

const mutations = {
    setTabName(state: State, newTabName: string){
        state.tabName = newTabName
    },
    setRequestList(state: State, newList: PhraseObject[]) {
        state.requestList = newList
    },
    setStaffPhraseList(state: State, newList: PhraseObject[]) {
        state.staffPhraseList = newList
    },
    setStaffList(state: State, newList: StaffObject[]) {
        state.staffList = newList
    },
    setRequestLoading(state: State, newLoading: boolean){
        state.requestLoading = newLoading
    },
    setPhraseLoading(state: State, newLoading: boolean){
        state.phraseLoading = newLoading
    },
    setStaffLoading(state: State, newLoading: boolean){
        state.staffLoading = newLoading
    },
    setUserRole(state: State, role: string) {
      state.role = role;
    },
    setUsername(state: State, name: string) {
      state.username = name;
    },
    setToken(state: State, token: string) {
      state.token = token;
    }
}

const actions = {
    async GetRequestsInfo({commit}: {commit: any}) {
        commit('setRequestList', null)
        try {
            const request = 'http://127.0.0.1:8000/api/moderator/phraseologies?status=pending'
            const { data } = await axios.get(request, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            })
            // commit('setState', { key: 'popularTags', value: data })
            commit('setRequestList', data)
            console.log(data)
        } catch (error) {
            if(error instanceof AxiosError && error.status == 401){
                router.push('/login')
            }
            console.error('Ошибка при загрузке запросов:', error)
        }
    },
    async GetPhraseInfoModerator({commit, dispatch}: {commit: any, dispatch: any}) {
        commit('setStaffPhraseList', null)
        try {
            const request = 'http://127.0.0.1:8000/api/moderator/phraseologies?status[]=approved&status[]=deletion_requested'
            const { data } = await axios.get(request, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            })
            // commit('setState', { key: 'popularTags', value: data })
            commit('setStaffPhraseList', data)
            console.log(data)
        } catch (error) {
            if(error instanceof AxiosError && error.status == 401){
                // return await router.push('/login')
                return await dispatch('logoutAction')
            }
            console.error('Ошибка при загрузке фразеологизмов:', error)
        }
    },
    async GetStaffInfoAdministrator({commit}: {commit: any}) {
        commit('setStaffLoading', true)
        commit('setStaffList', null)
        await new Promise(resolve => {
            setTimeout(resolve, 2000)
        })
        commit('setStaffList', ExampleStaff)
        commit('setStaffLoading', false)
    },
}

export default { state, getters, mutations, actions }