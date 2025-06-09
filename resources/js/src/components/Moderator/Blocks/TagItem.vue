<template>
    <div class="tag-list-item">
        <div class="tag tag-generic">
                {{tagInfo.content}}
            </div>
            <div class="use-count">
                {{tagInfo.count}}
            </div>
            <button class="button button-large delete-button" @click="removeTag">
                Удалить
            </button>
    </div>
</template>

<script lang="ts">
import TagObject from '@/assets/types/TagObject';
import { PropType } from 'vue';
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

    export default defineComponent({
        props:{
            tagInfo: {
                type: Object as PropType<TagObject>,
                required: true
            }
        },
        data(){
            return{
                isLoading: false as boolean
            }
        },
        methods: {
            ...mapActions(['removeTagSuggestion']),
            removeTag(){
                this.isLoading = true
                this.removeTagSuggestion({id: this.tagInfo.id})
            }
        },
    })
</script>

<style scoped>
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
</style>