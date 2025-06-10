import axios, { AxiosError } from "axios";
import router from "@/app/router";
import { z, ZodError } from "zod";

interface State {
    moderatorId: string | undefined,
    moderatorName: string;
    moderatorNameError: string | undefined;
    moderatorEmail: string;
    moderatorEmailError: string | undefined;
    moderatorContactEmail: string;
    moderatorContactEmailError: string | undefined;
    moderatorContactTelegram: string;
    moderatorContactTelegramError: string | undefined;
    moderatorPassword: string;
    moderatorPasswordError: string | undefined;
    moderatorContactError: string | undefined;
}

type response = {
    status: number,
    message: string,
    phraseology: any
}

export default {
    namespaced: true,
    state: {
        moderatorId: undefined,
        moderatorName: '',
        moderatorNameError: undefined,
        moderatorEmail: '',
        moderatorEmailError: undefined,
        moderatorContactEmail: '',
        moderatorContactEmailError: undefined,
        moderatorContactTelegram: '',
        moderatorContactTelegramError: undefined,
        moderatorPassword: '',
        moderatorPasswordError: undefined,
        moderatorContactError: undefined
    },

    getters: {
        moderatorId: (state: State) => state.moderatorId,
        moderatorName: (state: State) => state.moderatorName,
        moderatorNameError: (state: State) => state.moderatorNameError,
        moderatorEmail: (state: State) => state.moderatorEmail,
        moderatorEmailError: (state: State) => state.moderatorEmailError,
        moderatorContactEmail: (state: State) => state.moderatorContactEmail,
        moderatorContactEmailError: (state: State) => state.moderatorContactEmailError,
        moderatorContactTelegram: (state: State) => state.moderatorContactTelegram,
        moderatorContactTelegramError: (state: State) => state.moderatorContactTelegramError,
        moderatorPassword: (state: State) => state.moderatorPassword,
        moderatorPasswordError: (state: State) => state.moderatorPasswordError,
        moderatorContactError: (state: State) => state.moderatorContactError
    },

    mutations: {
        setModeratorId(state: State, id: string) {
            state.moderatorId = id
        },
        setModeratorName(state: State, name: string) {
            state.moderatorName = name
        },
        setModeratorNameError(state: State, error: string) {
            state.moderatorNameError = error
        },
        setModeratorEmail(state: State, email: string) {
            state.moderatorEmail = email
        },
        setModeratorEmailError(state: State, error: string) {
            state.moderatorEmailError = error
        },
        setModeratorContactEmail(state: State, email: string) {
            state.moderatorContactEmail = email;
        },
        setModeratorContactEmailError(state: State, error: string) {
            state.moderatorContactEmailError = error;
        },
        setModeratorContactTelegram(state: State, telegram: string) {
            state.moderatorContactTelegram = telegram;
        },
        setModeratorContactTelegramError(state: State, error: string) {
            state.moderatorContactTelegramError = error;
        },
        setModeratorPassword(state: State, password: string) {
            state.moderatorPassword = password;
        },
        setModeratorPasswordError(state: State, error: string) {
            state.moderatorPasswordError = error;
        },
        setModeratorContactError(state: State, error: string) {
            state.moderatorContactError = error;
        },
        clearErrors(state: State) {
            state.moderatorNameError = ''
            state.moderatorEmailError = ''
            state.moderatorContactEmailError = ''
            state.moderatorContactTelegramError = ''
            state.moderatorContactError = ''
            state.moderatorPasswordError = ''
        },
        clearForm(state: State) {
            console.log('penis')
            state.moderatorName = ''
            state.moderatorEmail = ''
            state.moderatorContactEmail = ''
            state.moderatorContactTelegram = ''
            state.moderatorPassword = ''

            state.moderatorNameError = ''
            state.moderatorEmailError = ''
            state.moderatorContactEmailError = ''
            state.moderatorContactTelegramError = ''
            state.moderatorContactError = ''
            state.moderatorPasswordError = ''
        }
    },

    actions: {
        async addModerator({ state, commit, rootGetters, dispatch }: { state: State, commit: any, rootGetters: any, dispatch: any }) {
            // const checkForm = (data: state): boolean => {
            const telegramUsernameRegex = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/;
            // }
            const formObject = z.object({
                name: z.string().min(3, 'Слишком короткое имя').max(255).nonempty('Введите имя модератора'),
                email: z.string().email('Введите почту').nonempty('Заполните поле'),
                contactTelegram: z.string().regex(telegramUsernameRegex, {
                    message: 'Введите Telegram никнейм (@username)',
                }).optional().or(z.literal('')),
                contactEmail: z.string().email('Введите почту').optional().or(z.literal('')),
                password: z.string().min(8, 'Пароль должен быть не меньше 8 символов').max(255).nonempty('Заполните поле')
            }).refine(data => {
                return data.contactEmail || data.contactTelegram;
            }, {
                message: 'Укажите email или Telegram',
                path: ['contactTelegram'], // можно указать одно из полей для отображения ошибки
            })

            commit('clearErrors')

            try {
                const result = formObject.parse({
                    name: state.moderatorName,
                    email: state.moderatorEmail,
                    contactEmail: state.moderatorContactEmail,
                    contactTelegram: state.moderatorContactTelegram,
                    password: state.moderatorPassword
                })

                // console.log(result)
                const token = rootGetters.token
                console.log(token)
                const request = 'http://127.0.0.1:8000/api/admin/moderators'
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
                const requestContent = {
                    name: result.name,
                    email: result.email,
                    notification_email: result.contactEmail,
                    telegram_chat_id: result.contactTelegram,
                    wants_email_notifications: result.contactEmail?.trim().length !== 0,
                    wants_telegram_notifications: result.contactTelegram?.trim().length !== 0,
                    password: result.password
                }
                console.log(requestContent)
                try {
                    const { data } = await axios.post<response>(request, requestContent, config)
                    window.alert(data.message)
                    return await router.push('/admin')
                } catch (e) {
                    if (e instanceof AxiosError) {
                        if(e.status === 401) return await dispatch('logoutAction', null, { root: true })
                        window.alert(e.response?.data.message)
                    }
                    console.error(e)
                }
            } catch (e) {
                if (e instanceof ZodError) {
                    e.errors.forEach((issue) => {
                        switch (issue.path[0]) {
                            case ('name'):
                                commit('setModeratorNameError', issue.message)
                                break;
                            case ('email'):
                                commit('setModeratorEmailError', issue.message)
                                break;
                            case ('contactTelegram'):
                                commit('setModeratorContactTelegramError', issue.message)
                                break;
                            case ('contactEmail'):
                                commit('setModeratorContactEmailError', issue.message)
                                break;
                            case ('password'):
                                commit('setModeratorPasswordError', issue.message)
                                break;
                            default:
                                break;
                        }
                    })
                    console.error(e.errors)
                    return
                }
            }
        },
        // async LoadPhraseInfo({ commit, rootGetters, dispatch }: any, payload: { phraseId: string }) {
        //     const token = rootGetters.token
        //     console.log(payload.phraseId)
        //     try {
        //         const request = 'http://localhost:8000/api/moderator/phraseologies/' + payload.phraseId
        //         const { data } = await axios.get<PhraseObject>(request, {
        //             headers: {
        //                 Authorization: `Bearer ${token}`
        //             }
        //         })
        //         // commit('setState', { key: 'popularTags', value: data })
        //         // commit('setStaffPhraseList', data)
        //         commit('setInputPhrase', data.content)
        //         commit('setInputExamples', data.contexts.map(el => el.content.replace(/['"]+/g, '')))
        //         commit('setInputMeaning', data.meaning)
        //         commit('setInputSelectedTags', data.tags)
        //         commit('setPhraseId', data.id)
        //         // console.log(data)
        //     } catch (error) {
        //         if (error instanceof AxiosError && error.status == 401) {
        //             // return await router.push('/login')
        //             return await dispatch('logoutAction', null, { root: true })
        //         }
        //         console.error('Ошибка при загрузке запроса:', error)
        //     }
        // },
        // async rejectPhrase({ state, rootGetters, dispatch }: { state: State, rootGetters: any, dispatch: any }) {

        //     const token = rootGetters.token
        //     console.log(token)
        //     const request = `http://127.0.0.1:8000/api/moderator/phraseologies/${state.phraseId}/reject`
        //     const config = {
        //         headers: {
        //             Authorization: `Bearer ${token}`
        //         },
        //     }
        //     try {
        //         const { data } = await axios.delete<response>(request, config)
        //         window.alert(`${data.message}`)
        //         return await router.push('/moderator')
        //     } catch (e) {
        //         if (e instanceof AxiosError && e.status === 401) {
        //             return await dispatch('logoutAction', null, { root: true })
        //         }
        //         window.alert('Ой, у вас не получилось😵‍💫')
        //         console.error(e)
        //     }
        // }
    }
}
