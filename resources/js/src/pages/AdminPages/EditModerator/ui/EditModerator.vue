<template>
    <LoadingIcon v-if="isLoading"/>
    <EditModeratorForm v-else/>
</template>

<script lang="ts">
import EditModeratorForm from '@/widgets/Administrator/Forms/EditModeratorForm';
import LoadingIcon from '@/shared/ui/LoadingIcon';
import { defineComponent } from 'vue';
import {  mapActions } from 'vuex';

    export default defineComponent({
        components: {
            EditModeratorForm,
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
            ...mapActions('editModeratorForm', ['LoadModeratorInfo'])
        },
        async beforeMount(){
            await this.LoadModeratorInfo({moderatorId: this.id})
            this.isLoading = false
        }
    })
</script>

<style>
    @import url('EditModerator');
</style>