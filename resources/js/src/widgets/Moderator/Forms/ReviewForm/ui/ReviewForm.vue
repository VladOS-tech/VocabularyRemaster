<template>
    <div class="review-block">
        <h2>Заполните указанные поля</h2>
        <div class="separator-line" />

        <textarea type="text" class="input-field input-field-header input-field-textarea"
            placeholder="Введите новый фразеологизм" @blur="updateInputPhrase" rows="1"
            :value="inputPhrase" @input="heightResize($event); setInputPhrase(($event.target as HTMLTextAreaElement).value)">
        </textarea>
        <div v-if="inputPhraseError" class="input-error">
            {{ inputPhraseError }}
        </div>
        <EditTags />
        <div v-if="inputTagsError" class="input-error">
            {{ inputTagsError }}
        </div>

        <EditMeanings />

        <div class="buttons-block">
            <button class="button button-large moderator-approve-button"
                @click="checkInput" :disabled="isLoading">
                Одобрить
            </button>
            <button class="button button-large moderator-cancel-button" @click="reject" :disabled="isLoading">
                Отклонить
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import EditMeanings from './EditMeanings.vue';
import EditTags from './EditTags.vue';

export default defineComponent({
    components: { EditMeanings, EditTags },
    data() {
        return {
            isLoading: false as boolean
        }
    },
    computed:{
        ...mapGetters(['isLoading']),
        ...mapGetters('reviewForm', ['inputPhrase', 'inputPhraseError', 'inputTagsError']),
        // inputPhrase: {
        //     get(): string {
        //         return this.inputPhrase
        //     },
        //     set(value: string){
        //         this.setInputPhrase(value)
        //     }
        // }
    },
    methods: {
        ...mapMutations(['setLoading']),
        ...mapMutations('reviewForm', ['setInputPhrase']),
        ...mapActions('reviewForm', ['approvePhrase', 'rejectPhrase']),
        updateInputPhrase() {
            //
        },
        heightResize(e: Event) {
            const textField = e.target as HTMLTextAreaElement;
            textField.style.height = '0px';
            textField.style.height = textField.scrollHeight + 'px';
        },
        async checkInput() {
            // store.commit('setInputTags', selectedTags.value); // Сохраняем выбранные теги
            this.isLoading = true
            await this.approvePhrase();
            this.isLoading = false
        },
        async reject(){
            this.isLoading = true
            await this.rejectPhrase();
            this.isLoading = false
        }
    }
})
</script>

<style scoped>
@import url('ReviewForm.css');
</style>
