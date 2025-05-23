<template>
    <LoadingIcon v-if="isLoading"/>
    <ReviewForm v-else/>
</template>

<script lang="ts">
import LoadingIcon from '@/components/Misc/LoadingIcon.vue';
import ReviewForm from '@/components/Moderator/Forms/ReviewForm.vue';
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

    export default defineComponent({
        components: {
            ReviewForm,
            LoadingIcon
        },
        props: {
            id: {
                type: String,
                required: true
            }
        },
        data(){
            return{
                isLoading: true as boolean
            }
        },
        methods:{
            ...mapActions('reviewForm', ['LoadPhraseInfo'])
        },
        async beforeMount(){
            await this.LoadPhraseInfo({phraseId: this.id})
            this.isLoading = false
        }
    })
</script>

<style>
    @import url('@/assets/style/pages/add-phrase.css');
</style>