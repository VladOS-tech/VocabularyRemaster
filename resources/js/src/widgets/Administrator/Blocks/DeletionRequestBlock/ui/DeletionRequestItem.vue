<template>
    <div class="deletion-request-block">
        <p class="deletion-request-post-date">
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
             <button class="button button-large button-confirm" @click="showConfirmationPopup" :disabled="isLoading">
                 Подтвердить
             </button>
             <button class="button button-large button-reject" @click="showReasonForm" :disabled="isLoading">
                 Отклонить
             </button>
         </div>
         <div v-if="showPopup" class="popup-form-container">
            <div class="popup-form">
                <div class="popup-title">
                    Причина отклонения
                </div>
                <textarea @input="heightResize" type="text" class="input-field input-field-regular input-field-textarea"
                    rows="1" maxlength="255" v-model="reason"></textarea>
                <div class="popup-button">
                    <button class="button button-large button-confirm" :disabled="reason.length < 3 || isLoading"  @click="rejectRequest">Готово</button>
                    <button class="button button-large button-reject" :disabled="isLoading" @click="hideReasonForm">Отмена</button>
                </div>
            </div>
        </div>
        <div v-if="showConfirmation" class="popup-form-container">
            <div class="popup-form">
                <div class="popup-title">
                    Удалить фразеологизм?
                </div>
                <div class="popup-button">
                    <button class="button button-large button-confirm" :disabled="isLoading" @click="acceptRequest">Да</button>
                    <button class="button button-large button-cancel" :disabled="isLoading" @click="hideConfirmationPopup">Отмена</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import DeletionRequestObject from '@/shared/types/DeletionRequestObject';
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
            showConfirmation: false as boolean,
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
            await this.acceptPhraseDeletion({id: this.RequestData.id})
        },
        async rejectRequest(){
            this.isLoading = true
            await this.rejectPhraseDeletion({id: this.RequestData.id, reason: this.reason})

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
        },
        showConfirmationPopup() {
            this.showConfirmation = true
        },
        hideConfirmationPopup() {
            this.showConfirmation = false
        }
    }
})
</script>

<style scoped>
@import url('DeletionRequestItem.css');

.removal-reason {
    color: var(--negative-color);
}

.deletion-request-row {
    display: flex;
    gap: 10px;
}
</style>