<template>
    <div class="tag-grid-container">
        <AddTagForm/>
        <TagsBlock/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';
import AddTagForm from '@/widgets/Moderator/Forms/AddTagForm';
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
        gap: 10px;
    }
</style>