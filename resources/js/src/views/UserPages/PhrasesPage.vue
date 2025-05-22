<template>
    <div class="phrases-page-main-grid">
        <div class="sort-area">
            <sortingSelection />
        </div>
        <loadingIcon v-if="isLoading" />
        <div class="phrase-area" v-else>
            <phraseBlock v-for="phrase in phraseList" :key="phrase.id" :PhraseData="phrase" />
        </div>
        <div class="sidebar-area">
            <helpBlock />
            <SidebarTags/>
        </div>
    </div>
</template>

<script lang="ts">
import sortingSelection from '@/components/Misc/SortingSelection.vue'
import phraseBlock from '@/components/Blocks/PhraseBlock.vue';
import helpBlock from '@/components/SidePanel/HelpBlock.vue';
import SidebarTags from '@/components/SidePanel/SidebarTags.vue';
import loadingIcon from '@/components/Misc/LoadingIcon.vue';
import { defineComponent } from 'vue';
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default defineComponent({
    components:{
        sortingSelection,
        phraseBlock,
        helpBlock,
        SidebarTags,
        loadingIcon
    },
    data(){
        return{
            pageName: 'Словарь Фразеологизмов' as string,
            isLoading: true as boolean
        }
    },
    computed:{
        ...mapGetters(['isLoading', 'phraseList', 'SidebarTags']),
    },
    methods:{
        ...mapMutations(['setPageName']),
        ...mapActions(['GetPhrasesInfo', 'UserPageLoadAllInfo'])
    },async beforeMount(){
        await this.GetPhrasesInfo()
        this.isLoading = false
    },
    mounted(){
        this.setPageName(this.pageName)
    },
})
</script>

<style scoped>
@import url('@/assets/style/pages/phrases-screen.css');
</style>