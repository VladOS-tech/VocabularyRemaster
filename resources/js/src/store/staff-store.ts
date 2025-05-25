import PhraseObject from "@/assets/types/PhraseObject"
import StaffObject from "@/assets/types/StaffObject"

import ExampleRequests from '@/assets/JSObjects/ExamplePhrases.json'
import ExampleStaff from '@/assets/JSObjects/ExampleStaff.json'
import axios, { AxiosError } from "axios"
import router from "@/router"
import TagObject from "@/assets/types/TagObject"

interface State {
    token: string,
    role: string,
    username: string,
    tabName: string,
    requestList: PhraseObject[] | null,
    staffPhraseList: PhraseObject[] | null,
    staffList: StaffObject[] | null,
    staffTagList: TagObject[] | null,
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
    staffPhraseList: null,
    staffList: null,
    staffTagList: null,
    requestLoading: true,
    phraseLoading: true,
    staffLoading: true
}

const getters = {
    tabName(state: State) {
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
    staffTagList(state: State) {
        return state.staffTagList
    },
    requestLoading(state: State) {
        return state.requestLoading
    },
    phraseLoading(state: State) {
        return state.phraseLoading
    },
    staffLoading(state: State) {
        return state.staffLoading
    },
    role(state: State) {
        return state.role
    },
    username(state: State) {
        return state.username
    },
    token(state: State) {
        return state.token
    }
}

const mutations = {
    setTabName(state: State, newTabName: string) {
        state.tabName = newTabName
    },
    setRequestList(state: State, newList: PhraseObject[]) {
        state.requestList = newList
    },
    setStaffTagList(state: State, newList: TagObject[]) {
        state.staffTagList = newList
    },
    removeStaffTag(state: State, removeId: number) {
        if(state.staffTagList) state.staffTagList = state.staffTagList?.filter(el => el.id != removeId)
    },
    setStaffPhraseList(state: State, newList: PhraseObject[]) {
        state.staffPhraseList = newList
    },
    setStaffList(state: State, newList: StaffObject[]) {
        state.staffList = newList
    },
    setStaffLoading(state: State, newLoading: boolean) {
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
    },
    setPhraseStatus(state: State, payload: { phraseId: string, newStatus: string }) {
        const phrase = state.staffPhraseList?.find(el => el.id === payload.phraseId)
        if (phrase) phrase.status = payload.newStatus
    }
}

const actions = {
    async GetRequestsInfo({ commit }: { commit: any }) {
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
            if (error instanceof AxiosError && error.status == 401) {
                router.push('/login')
            }
            console.error('Ошибка при загрузке запросов:', error)
        }
    },
    async GetPhraseInfoModerator({ commit, dispatch }: { commit: any, dispatch: any }) {
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
            if (error instanceof AxiosError && error.status == 401) {
                // return await router.push('/login')
                return await dispatch('logoutAction')
            }
            console.error('Ошибка при загрузке фразеологизмов:', error)
        }
    },
    async requestPhraseDeletion({ commit, dispatch }: { commit: any, dispatch: any }, payload: { phraseId: string }) {
        try {
            const request = `http://127.0.0.1:8000/api/moderator/phraseologies/${payload.phraseId}/delete-request`
            const { data } = await axios.patch(request, {}, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            })
            commit('setPhraseStatus', { phraseId: payload.phraseId, newStatus: 'deletion_requested' })
            console.log(data)
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                // return await router.push('/login')
                return await dispatch('logoutAction')
            }
            console.error('Ошибка при запросе удаления:', error)
        }
    },
    async GetStaffInfoAdministrator({ commit }: { commit: any }) {
        commit('setStaffLoading', true)
        commit('setStaffList', null)
        await new Promise(resolve => {
            setTimeout(resolve, 2000)
        })
        commit('setStaffList', ExampleStaff)
        commit('setStaffLoading', false)
    },
    async getTagsInfo({ commit }: any) {
        commit('setStaffTagList', null)
        try {
            const request = 'http://127.0.0.1:8000/api/moderator/tags'
            const { data } = await axios.get(request, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            })
            // commit('setState', { key: 'popularTags', value: data })
            commit('setStaffTagList', data.data.map((el: TagObject) => ({ id: el.id, content: el.content, timesUsed: 1000 })))
            console.log(data)
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                router.push('/login')
            }
            console.error('Ошибка при загрузке тегов:', error)
        }
    },
    async addTagSuggestion({ commit }: any, payload: { content: string }) {
        try {
            const request = 'http://127.0.0.1:8000/api/moderator/tags'
            const { data } = await axios.post(request,
                {
                    content: payload.content
                },
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                })
            // commit('setState', { key: 'popularTags', value: data })
            window.alert(data.message)
            router.go(0)
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                router.push('/login')
            }
            console.error('Ошибка при добавлении тега:', error)
        }
    },
    async removeTagSuggestion({ commit }: any, payload: { id: number }) {
        try {
            const request = 'http://127.0.0.1:8000/api/moderator/tags/' + payload.id
            const { data } = await axios.delete(request,
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                })
            commit('removeStaffTag', payload.id)
            // commit('setState', { key: 'popularTags', value: data })
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                router.push('/login')
            }
            console.error('Ошибка при удалении тега:', error)
        }
    }
}

export default { state, getters, mutations, actions }