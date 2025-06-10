import PhraseObject from "@/shared/types/PhraseObject"
import ModeratorObject from "@/shared/types/ModeratorObject"

import axios, { AxiosError } from "axios"
import router from "@/app/router"
import TagObject from "@/shared/types/TagObject"
import DeletionRequestObject from "@/shared/types/DeletionRequestObject"

interface State {
    token: string,
    role: string,
    username: string,
    tabName: string,
    requestList: PhraseObject[] | null,
    staffPhraseList: PhraseObject[] | null,
    moderatorList: ModeratorObject[] | null,
    staffTagList: TagObject[] | null,
    requestLoading: boolean,
    phraseLoading: boolean,
    staffLoading: boolean,
    adminDeletionRequestList: DeletionRequestObject[] | null,
}

const state: State = {
    token: '' as string,
    role: 'user' as string,
    username: '' as string,
    tabName: '',
    requestList: null,
    staffPhraseList: null,
    moderatorList: null,
    staffTagList: null,
    requestLoading: true,
    phraseLoading: true,
    staffLoading: true,
    adminDeletionRequestList: null
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
    moderatorList(state: State) {
        return state.moderatorList
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
    },
    adminDeletionRequestList(state: State) {
        return state.adminDeletionRequestList
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
    setModeratorList(state: State, newList: ModeratorObject[]) {
        state.moderatorList = newList
    },
    removeModerator(state: State, removeId: number) {
        if(state.moderatorList) state.moderatorList = state.moderatorList?.filter(el => el.id != removeId)
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
    },
    setAdminDeletionRequestList(state: State, newList: DeletionRequestObject[]) {
        state.adminDeletionRequestList = newList
    },
    removeAdminDeletionRequest(state: State, removeId: string) {
        if(state.adminDeletionRequestList) state.adminDeletionRequestList = state.adminDeletionRequestList?.filter(el => el.id != removeId)
    },
}

const actions = {
    async GetRequestsInfo({ commit, dispatch }: { commit: any, dispatch: any }) {
        commit('setRequestList', null)
        try {
            const request = 'http://127.0.0.1:8000/api/moderator/phraseologies?status=pending'
            console.log(request)
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
                return await dispatch('logoutAction', null, { root: true })
            }
            console.error('Ошибка при загрузке запросов:', error)
        }
    },
    async GetPhraseInfoModerator({ commit, dispatch }: { commit: any, dispatch: any }) {
        commit('setStaffPhraseList', null)
        try {
            const request = 'http://127.0.0.1:8000/api/moderator/phraseologies?status[]=approved&status[]=deletion_requested'
            console.log(request)
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
                return await dispatch('logoutAction', null, { root: true })
            }
            console.error('Ошибка при загрузке фразеологизмов:', error)
        }
    },
    async requestPhraseDeletion({ commit, dispatch }: { commit: any, dispatch: any }, payload: { phraseId: string, reason: string }) {
        try {
            const request = `http://127.0.0.1:8000/api/moderator/phraseologies/${payload.phraseId}/delete-request`
            console.log(request)
            const { data } = await axios.patch(request, {
                reason: payload.reason
            }, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            })
            commit('setPhraseStatus', { phraseId: payload.phraseId, newStatus: 'deletion_requested' })
            console.log(data)
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                return await dispatch('logoutAction')
            }
            console.error('Ошибка при запросе удаления:', error)
        }
    },
    async GetModeratorInfoAdministrator({ commit, dispatch }: { commit: any, dispatch: any }) {
        commit('setModeratorList', null)
        try {
            const request = 'http://127.0.0.1:8000/api/admin/moderators'
            const { data } = await axios.get(request, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            })
            // commit('setState', { key: 'popularTags', value: data })
            commit('setModeratorList', data.data)
            console.log(data)
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                return await dispatch('logoutAction', null, { root: true })
            }
            console.error('Ошибка при загрузке модераторов:', error)
        }
    },
    async getTagsInfo({ commit, dispatch }: { commit: any, dispatch: any }) {
        commit('setStaffTagList', null)
        try {
            const request = 'http://127.0.0.1:8000/api/moderator/tags'
            const { data } = await axios.get(request, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            })
            // commit('setState', { key: 'popularTags', value: data })
            commit('setStaffTagList', data.data.map((el: TagObject) => ({ id: el.id, content: el.content, count: el.count })))
            console.log(data)
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                return await dispatch('logoutAction', null, { root: true })
            }
            console.error('Ошибка при загрузке тегов:', error)
        }
    },
    async addTagSuggestion({ commit, dispatch }: { commit: any, dispatch: any }, payload: { content: string }) {
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
                return await dispatch('logoutAction', null, { root: true })
            }
            console.error('Ошибка при добавлении тега:', error)
        }
    },
    async removeTagSuggestion({ commit, dispatch }: { commit: any, dispatch: any }, payload: { id: number }) {
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
                return await dispatch('logoutAction', null, { root: true })
            }
            console.error('Ошибка при удалении тега:', error)
        }
    },
    async removeModeratorRequest({ commit, dispatch }: { commit: any, dispatch: any }, payload: { id: number }) {
        try {
            const request = 'http://127.0.0.1:8000/api/admin/moderators/' + payload.id
             await axios.delete(request,
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                })
            commit('removeModerator', payload.id)
            // commit('setState', { key: 'popularTags', value: data })
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                return await dispatch('logoutAction', null, { root: true })
            }
            console.error('Ошибка при удалении тега:', error)
        }
    },
    async GetDeletionRequestsAdministrator({ commit, dispatch }: { commit: any, dispatch: any }) {
        commit('setAdminDeletionRequestList', null)
        try {
            const request = 'http://127.0.0.1:8000/api/admin/deletion-requests'
            console.log(request)
            const { data } = await axios.get(request, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }   
            })
            // commit('setState', { key: 'popularTags', value: data })
            console.log(data)
            commit('setAdminDeletionRequestList', data)
            console.log(state.adminDeletionRequestList)
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                return await dispatch('logoutAction', null, { root: true })
            }
            console.error('Ошибка при загрузке запросов на удаление:', error)
        }
    },
    async acceptPhraseDeletion({ commit, dispatch }: { commit: any, dispatch: any }, payload: { id: number }) {
        try {
            const request = 'http://127.0.0.1:8000/api/admin/deletion-requests/' + payload.id + '/approve'
            console.log(request)
            const response = await axios.post(request, {},
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                })
            console.log(response)
            commit('removeAdminDeletionRequest', payload.id)
            // commit('setState', { key: 'popularTags', value: data })
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                return await dispatch('logoutAction', null, { root: true })
            }
            console.error('Ошибка при одобрении запроса:', error)
        }
    },
    async rejectPhraseDeletion({ commit, dispatch }: { commit: any, dispatch: any }, payload: { id: number, reason: string }) {
        try {
            const request = 'http://127.0.0.1:8000/api/admin/deletion-requests/' + payload.id + '/reject'
            const response = await axios.post(request, {
                comment: payload.reason
            },
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                })
                console.log(response)
            commit('removeAdminDeletionRequest', payload.id)
            // commit('setState', { key: 'popularTags', value: data })
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                return await dispatch('logoutAction', null, { root: true })
            }
            console.error('Ошибка при отклонении запроса:', error)
        }
    },
}

export default { state, getters, mutations, actions }