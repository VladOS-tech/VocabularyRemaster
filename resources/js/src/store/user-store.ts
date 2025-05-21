import { Store } from 'vuex'
import axios, { AxiosError } from 'axios'

import PhraseObject from "@/assets/types/PhraseObject"
import TagObject from "@/assets/types/TagObject"
import LoadingObject from "@/assets/types/LoadingObject"
import MeaningObject from "@/assets/types/MeaningObject"
import router from "@/router"
import exampleTags from "@/assets/JSObjects/ExampleTags.json"

interface State {
    isMobile: boolean;
    sortingOption: string;
    searchRequest: string;
    phraseList: PhraseObject[] | null;
    availableTags: TagObject[];
    searchSelectedTags: TagObject[];
    isLoading: LoadingObject;
}

const state: State = {
    isMobile: false,
    sortingOption: '',
    searchRequest: '',
    phraseList: null,
    availableTags: [],
    searchSelectedTags: [],
    isLoading: { phrases: true, tags: true, inputPhrase: true },
}

const getters = {
    isMobile: (state: State) => state.isMobile,
    phraseList: (state: State) => state.phraseList,
    sortingOption: (state: State) => state.sortingOption,
    searchRequest: (state: State) => state.searchRequest,
    popularTags: (state: State) => {
        console.log(state.availableTags)
        return state.availableTags.sort((tag) => tag.timesUsed)
    },
    availableTags: (state: State) => state.availableTags,
    searchSelectedTags: (state: State) => state.searchSelectedTags,
    isLoading: (state: State) => state.isLoading,
}

const mutations = {
    // setState<T>(state: State, { key, value }: { key: keyof State, value: T }) {
    //     state[key] = value as never
    // },
    setPhraseList(state: State, newlist: PhraseObject[]){
        state.phraseList = newlist;
    },
    setLoading(state: State, { whichLoading, newLoading }: { whichLoading: keyof LoadingObject, newLoading: boolean }) {
        state.isLoading[whichLoading] = newLoading
    },
    setAvailableTags(state: State, tags :TagObject[]){
        state.availableTags = tags;
    },
    setSearchSelectedTags(state: State, tags :TagObject[]){
        state.searchSelectedTags = tags;
    },
    addSearchSelectedTag(state: State, tag :TagObject){
        state.searchSelectedTags.push(tag);
    },
    removeSearchSelectedTag(state: State, tag :TagObject){
        state.searchSelectedTags = state.searchSelectedTags.filter(selectedtag => selectedtag.id !== tag.id)
    },
    setSortingOption(state: State, sortingOption :string){
        console.log(sortingOption)
        state.sortingOption = sortingOption;
    },
    setSearchRequest(state: State, searchRequest :string){
        console.log(searchRequest)
        state.searchRequest = searchRequest
    }
    // setSearchRecommendedTags(state: State, tags :TagObject[]){
    //     state.searchRecommendedTags = tags;
    // }
}

const actions = {
    async UserPageLoadAllInfo({ dispatch }: { dispatch: any }) {
        await Promise.all([dispatch('GetTags'), dispatch('GetPhrasesInfo')])
    },
    async GetSearchRecommendedTags({commit }: {commit: any}, searchText: string){
        //Api request for tags
        commit('setSearchRecommendedTags', exampleTags)
    },
    async GetTags({ commit }: { commit: any }) {
        commit('setLoading', { whichLoading: 'tags', newLoading: true })
        try {
            const { data } = await axios.get('http://127.0.0.1:8000/api/tags')
            console.log(data)
            // commit('setState', { key: 'popularTags', value: data })
            commit('setAvailableTags', data)
        } catch (error) {
            console.error('Ошибка при загрузке тегов:', error)
        } finally {
            commit('setLoading', { whichLoading: 'tags', newLoading: false })
        }
    },

    async GetPhrasesInfo({ state, commit }: { state: State, commit: any }) {

        const tagsToString = (tags: TagObject[]): string => {
            let tagString = ''
            tags.forEach(el => {
                tagString += el.id + ','
            })
            tagString = tagString.substring(0, tagString.length-1)
            return tagString
        }

        commit('setLoading', { whichLoading: 'phrases', newLoading: true })
        try {
            const tagString = tagsToString(state.searchSelectedTags)
            const apiRequest = 'http://localhost:8000/api/phraseologies?sort=' + state.sortingOption +
            '&tags=' + tagString +
            '&search=' + state.searchRequest
            console.log(apiRequest)
            const { data } = await axios.get(apiRequest)
            commit('setPhraseList', data)
            // commit('setState', { key: 'phrasesList', value: data })
        } catch (error) {
            console.error('Ошибка при загрузке фразеологизмов:', error)
        } finally {
            commit('setLoading', { whichLoading: 'phrases', newLoading: false })
        }
    }
}

export default { state, getters, mutations, actions }
