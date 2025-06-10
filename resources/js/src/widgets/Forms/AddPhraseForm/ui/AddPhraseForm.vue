<template>
    <div class="add-phrase-block add-phrase-block-light">
        <h2>Заполните указанные поля</h2>
        <div class="separator-line" />

        <textarea type="text" class="input-field input-field-header input-field-textarea"
            placeholder="Введите новый фразеологизм" @blur="updateInputPhrase" rows="1"
            :value="inputPhrase" @input="heightResize($event); setInputPhrase(($event.target as HTMLTextAreaElement).value)">
        </textarea>
        <div v-if="inputPhraseError" class="input-error">
            {{ inputPhraseError }}
        </div>
        <InputTags />
        <div v-if="inputTagsError" class="input-error">
            {{ inputTagsError }}
        </div>

        <InputMeanings />

        <div class="buttons-block">
            <button class="button button-large confirm-meaning-button"
                @click="checkInput">
                Готово
            </button>
            <router-link to="/" class="button button-large cancel-meaning-button link-style">
                Отмена
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InputMeanings from './InputMeanings.vue';
import InputTags from './InputTags.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default defineComponent({
    components: { InputMeanings, InputTags },
    data() {
        return {
            
        }
    },
    computed:{
        ...mapGetters(['isLoading']),
        ...mapGetters('phraseForm', ['inputPhrase', 'inputPhraseError', 'inputTagsError']),
    },
    methods: {
        ...mapMutations(['setLoading']),
        ...mapMutations('phraseForm', ['setInputPhrase']),
        ...mapActions('phraseForm', ['sendPhraseForm']),
        updateInputPhrase() {
            //
        },
        heightResize(e: Event) {
            const textField = e.target as HTMLTextAreaElement;
            textField.style.height = '0px';
            textField.style.height = textField.scrollHeight + 'px';
        },
        async checkInput() {
            this.setLoading({ whichLoading: 'inputPhrase', newLoading: true })
            await this.sendPhraseForm();
            this.setLoading({ whichLoading: 'inputPhrase', newLoading: false })
        },
        mounted() {
            this.setLoading({ whichLoading: 'inputPhrase', newLoading: false })
        },
    }
})
</script>

<style scoped>
@import url('AddPhraseForm.css');
</style>
