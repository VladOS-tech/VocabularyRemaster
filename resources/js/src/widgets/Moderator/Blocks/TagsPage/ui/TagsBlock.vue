<template>
    <div class="tag-list">
        <div class="tag-list-header">
            Название
        </div>
        <div class="tag-list-header">
            Использований
        </div>
        <div></div>
        <div v-if="isLoading" class="tag-loading-block">
            <LoadingIcon/>
        </div>
        <TagItem v-else v-for="(tag) in tagList" :key="tag.id" :tagInfo="tag"/>
    </div>
</template>

<script lang="ts">
import LoadingIcon from '@/shared/ui/LoadingIcon';
import { defineComponent } from 'vue';
import TagItem from './TagItem.vue';
import { mapActions, mapGetters } from 'vuex';
import TagObject from '@/shared/types/TagObject';

export default defineComponent({
    components:{
        LoadingIcon,
        TagItem
    },
    data(){
        return{
            isLoading: true as boolean
        }
    },
    computed:{
        ...mapGetters(['staffTagList']),
        tagList(): TagObject[] | null{
            return this.staffTagList
        }
    },
    methods:{
        ...mapActions(['getTagsInfo'])  
    },
    async beforeMount(){
        await this.getTagsInfo()
        this.isLoading = false
    }
})
</script>

<style scoped>
.tag-list {
    grid-area: tag-list;
    display: grid;
    grid-template-columns: 4fr 6fr 2fr;
    row-gap: 5px;
    column-gap: 10px;
}

.tag-loading-block{
    grid-column: 1 / -1;
}

.tag-list-header {
    font-family: var(--default-header-font-family);
    padding: 6px;
    font-size: 20px;
    font-weight: 500;

}

.delete-button {
    background-color: #FF3D3D;
}
</style>