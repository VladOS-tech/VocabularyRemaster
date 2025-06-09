<template>
    <div class="phrase-block phrase-block-light">
        <p class="post-date post-date-light">
            {{ dateToString(RequestData.created_at) }}
        </p>
        <h3>{{ RequestData.phraseology_content }}</h3>
        <div class="deletion-request-row">
            <h4>Предложил:</h4>
            <h4>{{ RequestData.moderator_name }} ({{ RequestData.moderator_email }})</h4>
        </div>
        <h3>Причина удаления:</h3>
        <h4 class="removal-reason">{{ RequestData.reason }}</h4>
         <div class="admin-staff-button">
             <button class="button button-large button-confirm" @click="acceptRequest" :disabled="isLoading">
                 Подтвердить
             </button>
             <button class="button button-large button-reject" @click="showReasonForm" :disabled="isLoading">
                 Отклонить
             </button>
         </div>
         <div v-if="showPopup" class="popup-form-container">
            <div class="popup-form">
                <div class="popup-title">
                    Причина удаления
                </div>
                <textarea @input="heightResize" type="text" class="input-field input-field-regular input-field-textarea"
                    rows="1" maxlength="255" v-model="reason"></textarea>
                <div class="popup-button">
                    <button class="button button-large button-confirm" :disabled="reason.length < 3"  @click="rejectRequest">Готово</button>
                    <button class="button button-large button-reject" @click="hideReasonForm">Отмена</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import DeletionRequestObject from '@/assets/types/DeletionRequestObject';
import { mapActions } from 'vuex';

export default defineComponent({
    props: {
        RequestData: {
            type: Object as PropType<DeletionRequestObject>,
            required: true
        }
    },
    data(){
        return{
            isLoading: false as boolean,
            showPopup: false as boolean,
            reason: '' as string
        }
    },
    methods: {
        ...mapActions(['rejectPhraseDeletion', 'acceptPhraseDeletion']),
        dateToString(date: Date): string {
            if (!date) return "Неизвестно";
            let newDate: RegExpMatchArray | null = date.toString().match(/^(\d{4})-(\d{2})-(\d{2}).*/)
            return `${newDate?.[3]}.${newDate?.[2]}.${newDate?.[1]}`
        },
        async acceptRequest(){
            this.isLoading = true
            this.acceptPhraseDeletion({id: this.RequestData.id})
        },
        async rejectRequest(){
            this.isLoading = true
            this.rejectPhraseDeletion({id: this.RequestData.id, reason: this.reason})

        },
        heightResize(e: Event) {
            const textField = e.target as HTMLTextAreaElement;
            textField.style.height = '0px';
            textField.style.height = textField.scrollHeight + 'px';
        },
        showReasonForm() {
            this.reason = ''
            this.showPopup = true
        },
        hideReasonForm() {
            this.showPopup = false
        }
    }
})
</script>

<style scoped>
@import url('@/assets/style/elements/phrase-style.css');

.removal-reason {
    color: #FF3D3D;
}

.deletion-request-row {
    display: flex;
    gap: 10px;
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

.button-reject {
    background-color: #FF3D3D;
}
</style>