<template>
    <div class="request-block">
        <loadingIcon v-if="isLoading" />
        <staffItemAdmin v-for="staff in moderatorList" :key="staff.id" :StaffData="staff" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import staffItemAdmin from './StaffItemAdmin.vue';
import LoadingIcon from '@/components/Misc/LoadingIcon.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

    export default defineComponent({
        components:{
            staffItemAdmin,
            LoadingIcon
        },
        data(){
            return {
                isLoading: true as boolean
            }
        },
        computed:{
            ...mapGetters(['moderatorList'])
        },
        methods:{
            ...mapMutations(['setTabName']),
            ...mapActions(['GetModeratorInfoAdministrator'])
        },
        async beforeMount(){
            this.setTabName('staff')
            await this.GetModeratorInfoAdministrator()
            this.isLoading = false
        }
    })
</script>

<style scoped>
    @import url('@/assets/style/moderator/elements/requests.css');
</style>

