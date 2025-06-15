<template>
    <header class="light-header-colors header-class">
        <router-link to="/" class="link-style">
            <h1>
                {{ pageName }}
            </h1>
        </router-link>
        <form v-if="$route.path !== '/add'" class="search-block" :class="{'mobile-search-block-active': isMobile && isSearchActive, 'search-block-inactive-mobile': !isSearchActive || !isMobile}">
            <input id="search-field-id" type="text" class="user-search-field user-search-field-light" placeholder="Поиск" v-model="searchInput" @keypress.enter="search" @input="search" @focus="isSearchActive = true" @blur="isSearchActive = false"/>
            <label for="search-field-id">
                <img src="@/shared/assets/images/search-icon.svg" alt="search-icon" class="search-icon-header search-icon-header-light">
            </label>
            <router-link class="button plus-button-header button-large link-style" to="/add">
                <img src="@/shared/assets/images/plus-icon.svg" alt="search-icon" class="plus-icon-header">
            </router-link>   
        </form>
    </header>
</template>

<script lang="ts">
    import { throttle } from '@/shared/lib/throttle';
import { defineComponent } from 'vue';
    import { mapGetters, mapActions, mapMutations } from 'vuex';

    export default defineComponent({
        data(){
            return{
                isSearchActive: false as boolean,
                throttleSearch: undefined as undefined | ((...any: any[]) => void)
            }
        },
        computed:{
            ...mapGetters(['pageName', 'isMobile', 'searchRequest']),
            searchInput: {
                get(): string{
                    return this.searchRequest
                },
                set(value: string){
                    this.setSearchRequest(value)
                }
            }
        },
        methods:{
            ...mapMutations(['setSearchRequest']),
            ...mapActions(['GetPhrasesInfo']),
            search(e: Event){
                e.preventDefault()
                !!this.throttleSearch && this.throttleSearch()
            }
        },
        beforeMount(){
            this.throttleSearch = throttle(() => {
                this.GetPhrasesInfo()
            },1000)
        }
    }) 
</script>

<style scoped>
    @import url('UserHeader.css');
</style>