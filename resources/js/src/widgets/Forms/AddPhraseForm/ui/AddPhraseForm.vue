<template>
    <div class="user-add-phrase-block">
        <h2>Заполните указанные поля</h2>
        <div class="user-separator-line" />

        <textarea type="text" class="input-field input-field-header input-field-textarea"
            placeholder="Введите новый фразеологизм" @blur="updateInputPhrase" rows="1" :value="inputPhrase"
            @input="heightResize($event); setInputPhrase(($event.target as HTMLTextAreaElement).value)">
        </textarea>
        <div v-if="inputPhraseError" class="input-error">
            {{ inputPhraseError }}
        </div>
        <InputTags />
        <div v-if="inputTagsError" class="input-error">
            {{ inputTagsError }}
        </div>

        <InputMeanings />
        <div class="turnstile-row">
            <TurnstileComponent sitekey="0x4AAAAAABhCy47tF322to7t" :onSuccess="handleTurnstile"/>
        </div>
        <div class="user-buttons-block">
            <!-- <LoadingIconSmall v-if="isLoading"/> -->

            <button class="button button-large user-confirm-phrase-button"
                :disabled="isLoading || !isTurnstileCompleted" @click="checkInput">
                Готово
            </button>
            <router-link to="/" class="button button-large user-cancel-phrase-button link-style"
                :class="isLoading ? 'router-link--disabled' : 'button'">
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
import TurnstileComponent from '@/shared/ui/TurnstileComponent';

export default defineComponent({
    components: {
        InputMeanings, InputTags,
        // LoadingIconSmall,
        TurnstileComponent
    },
    data() {
        return {
            isLoading: false as boolean,
            isTurnstileCompleted: false as boolean,
            turnstileToken: '' as string
        }
    },
    computed: {
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
            this.isLoading = true
            await this.sendPhraseForm({turnstileToken: this.turnstileToken});
            this.isLoading = false
        },
        handleTurnstile(token: string){
            this.isTurnstileCompleted = true;
            this.turnstileToken = token;
        }
    }
})
</script>

<style scoped>
@import url('AddPhraseForm.css');
</style>
