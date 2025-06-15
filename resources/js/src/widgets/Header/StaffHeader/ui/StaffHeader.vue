<template>
    <header class="light-header-colors header-class">
        <router-link to="/" class="link-style">
            <h1>
                {{ pageName }}
            </h1>
        </router-link>
        <div class="header-name-block">
            <div class="header-name">
                {{ username }}
            </div>
            <button class="button button-large logout-button" :disabled="isLoading" @click="onLogout">
                <img src="@/shared/assets/images/logout-icon.svg" alt="logout">
            </button>
        </div>
    </header>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { mapGetters, mapActions } from 'vuex';

    export default defineComponent({
        data(){
            return{
                isLoading: false as boolean
            }
        },
        computed:{
            ...mapGetters(['username', 'pageName'])
        },
        methods:{
            ...mapActions(['logoutAction']),
            async onLogout(){
                this.isLoading = true
                await this.logoutAction()
                this.isLoading = false
            }
        }
    }) 
</script>

<style scoped>
    @import url('StaffHeader.css');
</style>