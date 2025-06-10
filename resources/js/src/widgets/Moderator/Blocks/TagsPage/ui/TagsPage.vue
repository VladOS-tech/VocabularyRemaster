<template>
    <div class="tag-grid-container">
        <AddTagForm/>
        <TagsBlock/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';
import AddTagForm from '../Forms/AddTagForm.vue';
import TagsBlock from './TagsBlock.vue';

    export default defineComponent({
        components:{
            AddTagForm,
            TagsBlock
        },
        methods:{
            ...mapMutations(['setTabName'])
        },
        beforeMount(){
            this.setTabName('tags')
        }
    })
</script>

<style scoped>
    .tag-grid-container{
        display: grid;
        grid-template-columns: 2fr 4fr;
        grid-template-areas: 'add-tag tag-list';
    }
</style>