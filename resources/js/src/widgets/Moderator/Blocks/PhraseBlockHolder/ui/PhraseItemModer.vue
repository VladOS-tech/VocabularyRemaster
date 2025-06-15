<template>
    <div class="moderator-phrase-block">
        <p class="moderator-phrase-post-date">
            {{ dateToString(PhraseData.date) }}
        </p>
        <h2>{{ PhraseData.content }}</h2>
        <div class="moderator-tags-block">
            <div class="tag tag-generic" v-for="tag in PhraseData.tags" :key="tag.id">{{ tag.content }}</div>
        </div>
        <h3>Значение:</h3>
        <div class="moderator-meaning-block">
            <h4>{{ PhraseData.meaning }}</h4>
            <p class="moderator-meaning-example-text" v-for="context in PhraseData.contexts" :key="context.id">
                "{{ context.content }}"
            </p>
        </div>
        <div class="moder-phrase-button">
            <button class="button button-large remove-phrase-button"
                :disabled="PhraseData.status === 'deletion_requested'" @click="showReasonForm">
                Запросить удаление
            </button>
            <div class="deletion-requested" v-if="PhraseData.status === 'deletion_requested'">
                Удаление запрошено
            </div>
        </div>
        <div v-if="showPopup" class="popup-form-container">
            <div class="popup-form">
                <div class="popup-title">
                    Причина удаления
                </div>
                <textarea @input="heightResize" type="text" class="input-field input-field-regular input-field-textarea"
                    rows="1" maxlength="255" v-model="reason"></textarea>
                <div class="popup-button">
                    <button class="button button-large button-confirm" :disabled="reason.length < 3 || isLoading"  @click="requestDeletion">Готово</button>
                    <button class="button button-large button-cancel" :disabled="isLoading" @click="hideReasonForm">Отмена</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PhraseObject from '@/shared/types/PhraseObject';
import { mapActions } from 'vuex';

export default defineComponent({
    props: {
        PhraseData: {
            type: Object as PropType<PhraseObject>,
            required: true
        }
    },
    data() {
        return {
            isLoading: false as boolean,
            showPopup: false as boolean,
            reason: '' as string
        }
    },
    methods: {
        ...mapActions(['requestPhraseDeletion']),
        dateToString(date: Date): string {
            let newDate: RegExpMatchArray | null = date.toString().match(/^(\d{4})-(\d{2})-(\d{2}).*/)
            return `${newDate?.[3]}.${newDate?.[2]}.${newDate?.[1]}`
        },
        showReasonForm() {
            this.reason = ''
            this.showPopup = true
        },
        hideReasonForm() {
            this.showPopup = false
        },
        async requestDeletion() {
            this.isLoading = true
            await this.requestPhraseDeletion({ phraseId: this.PhraseData.id, reason: this.reason })
            this.hideReasonForm()
            this.isLoading = false
        },
        heightResize(e: Event) {
            const textField = e.target as HTMLTextAreaElement;
            textField.style.height = '0px';
            textField.style.height = textField.scrollHeight + 'px';
        }
    }
})
</script>

<style scoped>
@import url('PhraseStyle.css');
@import url('PhraseItem.css');

.deletion-requested {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>