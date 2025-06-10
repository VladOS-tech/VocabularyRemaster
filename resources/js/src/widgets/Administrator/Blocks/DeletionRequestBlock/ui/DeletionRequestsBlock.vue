<template>
    <div class="request-block">
        <loadingIcon v-if="isLoading" />
        <DeletionRequestItem v-for="request in adminDeletionRequestList" :key="request.id" :RequestData="request" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoadingIcon from '@/components/Misc/LoadingIcon.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import DeletionRequestItem from './DeletionRequestItem.vue';

    export default defineComponent({
        components:{
            DeletionRequestItem,
            LoadingIcon
        },
        data(){
            return {
                isLoading: true as boolean
            }
        },
        computed:{
            ...mapGetters(['adminDeletionRequestList'])
        },
        methods:{
            ...mapMutations(['setTabName']),
            ...mapActions(['GetDeletionRequestsAdministrator'])
        },
        async beforeMount(){
            this.setTabName('deletionRequests')
            await this.GetDeletionRequestsAdministrator()
            this.isLoading = false
        }
    })
</script>

<style scoped>
    @import url('@/assets/style/moderator/elements/requests.css');
</style>

