import TagObject from "@/assets/types/TagObject";
import exampleTags from "@/assets/JSObjects/ExampleTags.json"
import InputTags from "@/components/Forms/FormComponents/InputTags.vue";
import axios, { AxiosError } from "axios";
import router from "@/router";
import PhraseObject from "@/assets/types/PhraseObject";

interface State {
    phraseId: string | undefined,
    inputPhrase: string;
    inputPhraseError: string | undefined;
    inputTags: Set<TagObject>;
    inputTagsError: string | undefined;
    inputMeaning: string;
    inputMeaningError: string | undefined;
    inputExamples: string[];
    inputExamplesErrors: string[];
    inputSelectedTags: TagObject[];
    recommendedTags: TagObject[]
}

type response = {
    status: number,
    message: string,
    phraseology: any
}

export default {
    namespaced: true,
    state: {
        phraseId: undefined,
        inputPhrase: '',
        inputPhraseError: undefined,
        inputTags: new Set(),
        inputTagsError: undefined,
        inputMeaning: '',
        inputMeaningsError: undefined,
        inputExamples: [''],
        inputExamplesErrors: [''],
        inputSelectedTags: [],
        recommendedTags: []
    },

    getters: {
        phraseId: (state: State) => state.phraseId,
        inputPhrase: (state: State) => state.inputPhrase,
        inputPhraseError: (state: State) => state.inputPhraseError,
        inputTags: (state: State) => state.inputTags,
        inputTagsError: (state: State) => state.inputTagsError,
        inputMeaning: (state: State) => state.inputMeaning,
        inputMeaningError: (state: State) => state.inputMeaningError,
        inputExamples: (state: State) => state.inputExamples,
        inputExamplesErrors: (state: State) => state.inputExamplesErrors,
        inputSelectedTags: (state: State) => state.inputSelectedTags,
        recommendedTags: (state: State) => state.recommendedTags,
    },

    mutations: {
        setPhraseId(state: State, id: string) {
            state.phraseId = id
        },
        setInputPhrase(state: State, phrase: string) {
            state.inputPhrase = phrase
        },
        setInputPhraseError(state: State, error: string) {
            state.inputPhraseError = error
        },
        setInputTags(state: State, tags: Set<TagObject>) {
            state.inputTags = tags
        },
        setInputTagsError(state: State, error: string) {
            state.inputTagsError = error
        },
        setInputSelectedTags(state: State, tags: TagObject[]) {
            state.inputSelectedTags = tags;
        },
        setRecommendedTags(state: State, tags: TagObject[]) {
            state.recommendedTags = tags;
        },
        addInputSelectedTag(state: State, tag: TagObject) {
            state.inputSelectedTags.push(tag);
        },
        removeInputSelectedTag(state: State, tag: TagObject) {
            state.inputSelectedTags = state.inputSelectedTags.filter(selectedtag => selectedtag.id !== tag.id)
        },
        setInputMeaning(state: State, meaning: string) {
            state.inputMeaning = meaning
        },
        setInputMeaningError(state: State, error: string) {
            state.inputMeaningError = error
        },
        setInputExamples(state: State, examples: string[]) {
            state.inputExamples = examples
        },
        addInputExample(state: State) {
            state.inputExamples.push('')
        },
        removeInputExample(state: State, index: number) {
            state.inputExamples.splice(index, 1)
        },
        setInputExample(state: State, payload: { index: number, example: string }) {
            state.inputExamples[payload.index] = payload.example
        },
        addInputExampleError(state: State) {
            state.inputExamplesErrors.push('')
        },
        removeInputExampleError(state: State, index: number) {
            state.inputExamplesErrors.splice(index, 1)
        },
        setInputExampleError(state: State, payload: { index: number, error: string }) {
            state.inputExamplesErrors[payload.index] = payload.error
        },
        clearErrors(state: State) {
            state.inputPhraseError = ''
            state.inputTagsError = ''
            state.inputMeaningError = ''
            state.inputExamples.forEach((_, index) => {
                state.inputExamplesErrors[index] = ''
            })
        },
        clearForm(state: State) {
            state.inputPhrase = ''
            state.inputSelectedTags = []
            state.inputMeaning = ''
            state.inputExamples = ['']

            state.inputPhraseError = ''
            state.inputTagsError = ''
            state.inputMeaningError = ''
            state.inputExamples.forEach((_, index) => {
                state.inputExamplesErrors[index] = ''
            })
        }
    },

    actions: {
        async approvePhrase({ state, commit, rootGetters, dispatch }: { state: State, commit: any, rootGetters: any, dispatch: any }) {

            const tagsToIds = (tags: TagObject[]): number[] => tags.map(el => el.id)

            // const examplesToString = (examples: string[]): string => {
            //     let examplesString = '['
            //     examples.forEach(el => {
            //         examplesString += el + ','
            //     })
            //     examplesString = examplesString.substring(0, examplesString.length - 1)
            //     examplesString += ']'
            //     return examplesString
            // }

            const emptyChecks = (valid: boolean): boolean => {
                let isFilled = valid
                if (!state.inputPhrase) {
                    commit('setInputPhraseError', 'Введите фразеологизм')
                    isFilled = false;
                }
                if (state.inputSelectedTags.length === 0) {
                    commit('setInputTagsError', 'Добавьте хотя бы 1 тег')
                    isFilled = false;
                }
                if (!state.inputMeaning) {
                    commit('setInputMeaningError', 'Введите значение')
                    isFilled = false;
                }
                state.inputExamples.forEach((example, index) => {
                    if (!example) {
                        commit('setInputExampleError', { index, error: 'Заполните пример использования' })
                        isFilled = false
                    }
                })
                return isFilled
            }
            let valid = true
            commit('clearErrors')
            valid = emptyChecks(valid)
            if (state.inputPhrase.length > 255) {
                commit('setInputPhraseError', 'Длина фразеологизма превышает 255 символов')
                valid = false;
            }
            if (valid) {
                const token = rootGetters.token
                console.log(token)
                const request = 'http://127.0.0.1:8000/api/moderator/phraseologies/' + state.phraseId
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
                const requestContent = {
                    content: state.inputPhrase,
                    contexts: Array.from(state.inputExamples),
                    meaning: state.inputMeaning,
                    tags: tagsToIds(Array.from(state.inputSelectedTags))
                }
                console.log(requestContent)
                try {
                    await axios.put<response>(request, requestContent, config)
                    const approveResponse = await axios.patch<response>(`http://127.0.0.1:8000/api/moderator/phraseologies/${state.phraseId}/approve`, {} , config)
                    window.alert(`${approveResponse.data.message}`)
                    return await router.push('/moderator')
                } catch (e) {
                    if (e instanceof AxiosError && e.status === 401) {
                        return await dispatch('logoutAction', null, { root: true })
                    }
                    window.alert('Ой, у вас не получилось😵‍💫')
                    console.error(e)
                }
            }
        },
        // async GetRecommendedTags({ commit }: { commit: any }, searchText: string) {
        //     //Api request for tags
        //     try {
        //         const { data } = await axios.get('http://127.0.0.1:8000/api/tags')
        //         console.log(data)
        //         // commit('setState', { key: 'popularTags', value: data })
        //         commit('setRecommendedTags', data)
        //     } catch (error) {
        //         console.error('Ошибка при загрузке тегов:', error)
        //     }
        // },
        async LoadPhraseInfo({ commit, rootGetters, dispatch }: any, payload: { phraseId: string }) {
            const token = rootGetters.token
            console.log(payload.phraseId)
            try {
                const request = 'http://localhost:8000/api/moderator/phraseologies/' + payload.phraseId
                const { data } = await axios.get<PhraseObject>(request, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                // commit('setState', { key: 'popularTags', value: data })
                // commit('setStaffPhraseList', data)
                commit('setInputPhrase', data.content)
                commit('setInputExamples', data.contexts.map(el => el.content.replace(/['"]+/g, '')))
                commit('setInputMeaning', data.meaning)
                commit('setInputSelectedTags', data.tags)
                commit('setPhraseId', data.id)
                // console.log(data)
            } catch (error) {
                if (error instanceof AxiosError && error.status == 401) {
                    // return await router.push('/login')
                    return await dispatch('logoutAction', null, { root: true })
                }
                console.error('Ошибка при загрузке запроса:', error)
            }
        },
        async rejectPhrase({ state, rootGetters, dispatch }: { state: State, rootGetters: any, dispatch: any }) {

            const token = rootGetters.token
            console.log(token)
            const request = `http://127.0.0.1:8000/api/moderator/phraseologies/${state.phraseId}/reject`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
            try {
                const { data } = await axios.patch<response>(request, {} , config)
                window.alert(`${data.message}`)
                return await router.push('/moderator')
            } catch (e) {
                if (e instanceof AxiosError && e.status === 401) {
                    return await dispatch('logoutAction', null, { root: true })
                }
                window.alert('Ой, у вас не получилось😵‍💫')
                console.error(e)
            }
        }
    }
}
