import PhraseObject from "@/assets/types/PhraseObject"
import StaffObject from "@/assets/types/StaffObject"

import ExampleRequests from '@/assets/JSObjects/ExamplePhrases.json'
import ExampleStaff from '@/assets/JSObjects/ExampleStaff.json'

interface State {
    token: string,
    role: string,
    username: string,
    tabName: string,
    requestList: PhraseObject[] | null,
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
        commit('setRequestLoading', true)
        await new Promise(resolve => {
            setTimeout(resolve, 2000)
        })
        commit('setRequestList', ExampleRequests)
        commit('setRequestLoading', false)
    },
    async GetPhraseInfoModerator({commit}: {commit: any}) {
        commit('setPhraseLoading', true)
        commit('setPhraseList', null)
        await new Promise(resolve => {
            setTimeout(resolve, 2000)
        })
        commit('setPhraseList', ExampleRequests)
        commit('setPhraseLoading', false)
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