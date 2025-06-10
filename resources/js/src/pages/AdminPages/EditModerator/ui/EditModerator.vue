<template>
    <LoadingIcon v-if="isLoading"/>
    <EditModeratorForm v-else/>
</template>

<script lang="ts">
import EditModeratorForm from '@/components/Administrator/Forms/EditModeratorForm.vue';
import LoadingIcon from '@/components/Misc/LoadingIcon.vue';
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
    @import url('@/assets/style/pages/add-phrase.css');
</style>