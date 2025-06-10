<template>
    <div class="login-container">
        <LoginForm/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginForm from '@/widgets/Forms/LoginForm';
import { mapMutations } from 'vuex';

    export default defineComponent({
        components:{
            LoginForm
        },
        data() {
            return{
                pageName: 'Авторизация' as string
            }
        },
        methods:{
            ...mapMutations(['setPageName'])
        },
        mounted(){
            this.setPageName(this.pageName)
        }
    })
</script>

<style scoped>
    @import url('LoginPage');
</style>