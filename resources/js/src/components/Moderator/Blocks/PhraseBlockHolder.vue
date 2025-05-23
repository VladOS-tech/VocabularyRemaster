<template>
    <div class="request-block">
        <loadingIcon v-if="isLoading" />
        <phraseItemModer v-else v-for="phrase in staffPhraseList" :key="phrase.id" :PhraseData="phrase" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import phraseItemModer from '@/components/Moderator/Blocks/PhraseItemModer.vue';
import LoadingIcon from '@/components/Misc/LoadingIcon.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

    export default defineComponent({
        data(){
            return{
                isLoading: true as boolean
            }
        },
        components:{
            phraseItemModer,
            LoadingIcon
        },
        computed:{
            ...mapGetters(['phraseLoading', 'requestList', 'staffPhraseList'])
        },
        methods:{
            ...mapMutations(['setTabName']),
            ...mapActions(['GetPhraseInfoModerator'])
        },
        async beforeMount(){
            this.setTabName('phrases')
            await this.GetPhraseInfoModerator()
            this.isLoading = false
        }
    })
</script>

<style scoped>
    @import url('@/assets/style/moderator/elements/requests.css');
</style>

