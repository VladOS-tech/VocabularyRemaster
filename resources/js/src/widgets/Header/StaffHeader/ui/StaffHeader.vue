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
            <div class="button button-large logout-button" @click="onLogout">
                <img src="@/shared/assets/images/logout-icon.svg" alt="logout">
            </div>
        </div>
    </header>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { mapGetters, mapActions } from 'vuex';

    export default defineComponent({
        computed:{
            ...mapGetters(['username', 'pageName'])
        },
        methods:{
            ...mapActions(['logoutAction']),
            onLogout(){
                this.logoutAction()
            }
        }
    }) 
</script>

<style scoped>
    @import url('StaffHeader.css');
</style>