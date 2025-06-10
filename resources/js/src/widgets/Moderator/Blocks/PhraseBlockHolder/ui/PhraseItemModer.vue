<template>
    <div class="phrase-block phrase-block-light">
        <p class="post-date post-date-light">
            {{ dateToString(PhraseData.date) }}
        </p>
        <h2>{{ PhraseData.content }}</h2>
        <div class="tags-block">
            <div class="tag tag-generic" v-for="tag in PhraseData.tags" :key="tag.id">{{ tag.content }}</div>
        </div>
        <h3>Значение</h3>
        <div class="meaning-block meaning-block-light">
            <h4>{{ PhraseData.meaning }}</h4>
            <p class="meaning-example-text" v-for="context in PhraseData.contexts" :key="context.id">
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
                    <button class="button button-large button-confirm" :disabled="reason.length < 3"  @click="requestDeletion">Готово</button>
                    <button class="button button-large button-cancel" @click="hideReasonForm">Отмена</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PhraseObject from '@/assets/types/PhraseObject';
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
@import url('@/assets/style/elements/phrase-style.css');
@import url('@/assets/style/moderator/elements/phrase-item.css');

.deletion-requested {
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-form-container {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
}

.popup-form {
    display: flex;
    flex-direction: column;
    align-self: center;
    gap: 10px;
    border-radius: var(--default-border-radius);
    border-style: solid;
    border-width: 0px;
    border-color: var(--border-color);
    padding: 10px;
    box-shadow: var(--default-shadow);
    background: var(--block-background-gradient);
}

.popup-title {
    font-size: 32px;
    font-family: var(--default-header-font-family);
    font-weight: 500;
    font-style: normal;
}

.popup-button {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.button-confirm {
    background-color: #7FED7C;
}

.button-cancel {
    background-color: #FF3D3D;
}
</style>