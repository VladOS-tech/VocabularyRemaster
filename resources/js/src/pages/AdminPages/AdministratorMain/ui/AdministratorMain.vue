<template>
    <div class="admin-main-grid">
        <!-- <div class="sort-area">
                <form action="-IDK-" class="search-block">
                <input id="search-field-moderator-id" type="text" class="admin-search-field admin-search-field-light" placeholder="Поиск" v-model="searchInput"/>
                <label for="search-field-moderator-id">
                    <img src="@/assets/images/icons/search-icon.svg" alt="search-icon" class="search-icon-header search-icon-header-light">
                </label>
            </form>
        </div> -->
        <div class="tabs-area">
            <router-link :class="tabName=='staff' ? 'tab-selected' : 'tab-unselected'" class="tab-style button tab-button" to="/admin/staff">Модерация</router-link>
            <div class="tabs-vertical-separator">
            </div>
            <router-link :class="tabName=='deletionRequests' ? 'tab-selected' : 'tab-unselected'" class="tab-style button tab-button" to="/admin/deletion-requests">Запросы на удаление</router-link>
            <div class="tabs-vertical-separator">
            </div>
            <router-link class="link-style button button-large review-button" to="/admin/add-moderator">Добавить модератора</router-link>
        </div>
        <div class="request-area">
            <router-view/>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { mapGetters, mapMutations } from 'vuex';

export default defineComponent({

        data() {
            return{
                pageName: 'Администрация' as string,
                searchInput: '' as string
            }
        },
        computed:{
            ...mapGetters(['tabName'])
        },
        methods:{
            ...mapMutations(['setPageName', 'setTabName'])
        },
        mounted(){

            // Перенести в компоненте переназначение тега

            this.setPageName(this.pageName)
        }
})

</script>

<style scoped>
    @import url('AdministratorMain.css');
</style>