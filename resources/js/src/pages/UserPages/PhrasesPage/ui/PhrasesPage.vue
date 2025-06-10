<template>
    <div class="phrases-page-main-grid">
        <div class="sort-area">
            <SortingSelection />
        </div>
        <LoadingIcon v-if="isLoading" />
        <div class="phrase-area" v-else>
            <PhraseBlock v-for="phrase in phraseList" :key="phrase.id" :PhraseData="phrase" />
        </div>
        <div class="sidebar-area">
            <HelpBlock />
            <SidebarTags/>
        </div>
    </div>
</template>

<script lang="ts">
import SortingSelection from '@/shared/ui/SortingSelection';
import PhraseBlock from '@/widgets/Blocks/PhraseBlock';
import HelpBlock from '@/shared/ui/Sidebar/HelpBlock';
import SidebarTags from '@/shared/ui/Sidebar/SidebarTags';
import LoadingIcon from '@/shared/ui/LoadingIcon';
import { defineComponent } from 'vue';
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default defineComponent({
    components:{
        SortingSelection,
        PhraseBlock,
        HelpBlock,
        SidebarTags,
        LoadingIcon
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
@import url('PhrasesPage.css');
</style>