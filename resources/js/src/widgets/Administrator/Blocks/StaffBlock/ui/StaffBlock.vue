<template>
    <div class="staff-block-holder">
        <LoadingIcon v-if="isLoading" />
        <StaffItemAdmin v-for="staff in moderatorList" :key="staff.id" :StaffData="staff" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StaffItemAdmin from './StaffItemAdmin.vue';
import LoadingIcon from '@/shared/ui/LoadingIcon';
import { mapActions, mapGetters, mapMutations } from 'vuex';

    export default defineComponent({
        components:{
            StaffItemAdmin,
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
    @import url('StaffBlock.css');
</style>

