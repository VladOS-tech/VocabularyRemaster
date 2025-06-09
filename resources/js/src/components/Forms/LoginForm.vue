<template>
    <form class="login-form login-form-light" @submit.prevent="onLogin">
        <h2>
            Авторизация
        </h2>
        <div class="separator-line"/>
        <div class="login-field-holder">
            <h4>Email:</h4>
            <input type="text" class="input-field input-field-regular" v-model="login" >
        </div>
        <div v-if="errors.login" class="input-error">{{ errors.login }}</div>
        <div class="login-field-holder">
            <h4>Пароль:</h4>
            <input type="password" class="input-field input-field-regular" v-model="password">
        </div>
        <div v-if="errors.password" class="input-error">{{ errors.password }}</div>
        <div v-if="errors.root" class="input-error">{{ errors.root }}</div>
        <button class="button button-large login-button" type="submit">
            Вход
        </button>
    </form>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
import { mapActions } from 'vuex'
    import { z } from 'zod'

    const loginValidation = z.object({
        login: z.string().min(3, {message: 'Email не может быть короче 3 символов'}).max(40, {message: 'Email не может быть длинее 40 символов'}).email('Введите Email'),
        password: z.string().min(3, {message: 'Пароль не может быть короче 3 символов'}).max(20, {message: 'Пароль не может быть длинее 20 символов'})
    })

    // type LoginValidationType = z.infer<typeof loginValidation>

    export default defineComponent({
        data(){
            return{
                login: 'admin@example.com' as string,
                password: 'Secret123' as string,
                errors:{
                    login: null as null | string,
                    password: null as null | string,
                    root: null as null | string
                }
            }
        },
        methods: {
            ...mapActions(['loginAction']),
            async onLogin(){
                this.errors = {login: null, password: null, root: null}
                const result = loginValidation.safeParse({login: this.login, password: this.password})
                if(result.success){
                    const loginErr = await this.loginAction({login: result.data.login, password: result.data.password})
                    this.errors.root = loginErr
                }
                else{
                    result.error.issues.forEach((issue) => {
                        switch(issue.path[0]){
                            case('login'):
                                this.errors.login = issue.message
                                break;
                            case('password'):
                                this.errors.password = issue.message
                                break;
                            case('root'):
                                this.errors.root = issue.message
                                break;
                            default:
                                break;
                        }
                    })
                }
            }
        }
    })
</script>

<style scoped>
    @import url('@/assets/style/forms/login-form.css');
</style>