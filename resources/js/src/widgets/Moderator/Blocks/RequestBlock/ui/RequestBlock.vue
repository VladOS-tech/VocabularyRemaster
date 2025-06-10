<template>
    <div class="request-block">
        <loadingIcon v-if="isLoading" />
        <RequestItem v-else v-for="request in requestList" :key="request.id" :RequestData="request" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RequestItem from './RequestItem.vue';
import LoadingIcon from '@/shared/ui/LoadingIcon';
import { mapActions, mapGetters, mapMutations } from 'vuex';

    export default defineComponent({
        components:{
            RequestItem,
            LoadingIcon
        },
        data(){
            return{
                isLoading: true as boolean
            }
        },
        computed:{
            ...mapGetters(['requestLoading', 'requestList'])
        },
        methods:{
            ...mapMutations(['setTabName']),
            ...mapActions(['GetRequestsInfo'])
        },
        async beforeMount(){
            this.setTabName('requests')
            await this.GetRequestsInfo()
            this.isLoading = false
        }
    })
</script>

<style scoped>
    @import url('Requests.css');
</style>

