<template>
    <div class="tag-list-item">
        <div class="tag tag-generic">
            {{ tagInfo.content }}
        </div>
        <div class="use-count">
            {{ tagInfo.count }}
        </div>
        <button class="button button-large delete-tag-button" @click="showConfirmationPopup">
            Удалить
        </button>
        <div v-if="showPopup" class="popup-form-container">
            <div class="popup-form">
                <div class="popup-title">
                    Удалить тег?
                </div>
                <div class="popup-button">
                    <button class="button button-large button-confirm" :disabled="removeLoading" @click="removeTag">Да</button>
                    <button class="button button-large button-cancel" :disabled="removeLoading" @click="hideConfirmationPopup">Отмена</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import TagObject from '@/shared/types/TagObject';
import { PropType } from 'vue';
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
    props: {
        tagInfo: {
            type: Object as PropType<TagObject>,
            required: true
        }
    },
    data() {
        return {
            isLoading: false as boolean,
            showPopup: false as boolean,
            removeLoading: false as boolean
        }
    },
    methods: {
        ...mapActions(['removeTagSuggestion']),
        async removeTag() {
            this.isLoading = true
            this.removeLoading = true
            await this.removeTagSuggestion({ id: this.tagInfo.id })
            this.hideConfirmationPopup()
        },
        showConfirmationPopup() {
            this.showPopup = true
            this.removeLoading = false
        },
        hideConfirmationPopup() {
            this.showPopup = false
            this.removeLoading = false
        },
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
    background-color: var(--separator);
    display: block;
    margin-top: -1px;
}

.delete-tag-button {
    background-color: var(--negative-color);
}
</style>