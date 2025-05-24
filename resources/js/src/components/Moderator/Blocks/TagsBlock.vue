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
        <div class="tag-list-item" v-else v-for="(item, index) in Array(20)" :key="index">
            <div class="tag tag-generic">
                item
            </div>
            <div class="use-count">
                index
            </div>
            <button class="button button-large delete-button">
                Удалить
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import LoadingIcon from '@/components/Misc/LoadingIcon.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    components:{
        LoadingIcon
    },
    data(){
        return{
            isLoading: true as boolean
        }
    },
    async beforeMount(){
        await new Promise(resolve => [
            setTimeout(resolve, 2000)
        ])
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

.tag-list-item {
    display: contents;
}

.tag-list-item:after {
    content: "";
    grid-column: 1 / -1;
    height: 1px;
    background: var(--border-color);
    display: block;
    margin-top: -1px;
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