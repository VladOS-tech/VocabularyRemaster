<template>
    <AddModeratorForm />
</template>

<script lang="ts">
import AddModeratorForm from '@/components/Administrator/Forms/AddModeratorForm.vue';
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
    @import url('@/assets/style/pages/add-phrase.css');
</style>