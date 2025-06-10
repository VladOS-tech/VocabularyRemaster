<template>
    <AddModeratorForm />
</template>

<script lang="ts">
import AddModeratorForm from '@/widgets/Administrator/Forms/AddModeratorForm';
import { defineComponent } from 'vue';
import {  mapMutations } from 'vuex';

    export default defineComponent({
        components: {
            AddModeratorForm
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
            ...mapMutations('addModeratorForm', ['clearForm'])
        },
        async beforeMount(){
            await this.clearForm()
        }
    })
</script>

<style>
    @import url('AddModerator.css');
</style>