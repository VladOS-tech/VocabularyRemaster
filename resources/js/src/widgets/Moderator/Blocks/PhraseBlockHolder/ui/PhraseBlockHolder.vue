<template>
    <div class="request-block">
        <loadingIcon v-if="isLoading" />
        <PhraseItemModer v-else v-for="phrase in staffPhraseList" :key="phrase.id" :PhraseData="phrase" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PhraseItemModer from './PhraseItemModer.vue';
import LoadingIcon from '@/shared/ui/LoadingIcon';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default defineComponent({
    data() {
        return {
            isLoading: true as boolean
        }
    },
    components: {
        PhraseItemModer,
        LoadingIcon
    },
    computed: {
        ...mapGetters(['phraseLoading', 'requestList', 'staffPhraseList'])
    },
    methods: {
        ...mapMutations(['setTabName']),
        ...mapActions(['GetPhraseInfoModerator'])
    },
    async beforeMount() {
        this.setTabName('phrases')
        await this.GetPhraseInfoModerator()
        this.isLoading = false
    }
})
</script>

<style scoped>
@import url('Requests.css');

</style>
