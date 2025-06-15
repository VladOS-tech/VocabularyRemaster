<template>
    <div>
        <div class="edit-moderator-block">
            <h2>Изменение данных модератора</h2>
            <div class="separator-line" />

            <div class="input-row">
                <h3 class="input-row-title">
                    Имя:
                </h3>
                <input type="text" class="input-field input-field-regular" placeholder="Введите имя модератора"
                    :value="moderatorName" @input="setModeratorName(($event.target as HTMLTextAreaElement).value)" />
            </div>
            <div v-if="moderatorNameError" class="input-error">
                {{ moderatorNameError }}
            </div>

            <div class="input-row">
                <h3 class="input-row-title">
                    Почта:
                </h3>
                <input type="text" class="input-field input-field-regular" placeholder="Введите почту модератора"
                    :value="moderatorEmail" @input="setModeratorEmail(($event.target as HTMLTextAreaElement).value)" />
            </div>
            <div v-if="moderatorEmailError" class="input-error">
                {{ moderatorEmailError }}
            </div>
            <div class="input-row">
                <h3 class="input-row-title">
                    Контакт (как минимум 1):
                </h3>
            </div>
            <div class="input-row">
                <h4 class="input-row-title">
                    Почта:
                </h4>
                <input type="text" class="input-field input-field-regular" placeholder="Введите контактную почту"
                    :value="moderatorContactEmail"
                    @input="setModeratorContactEmail(($event.target as HTMLTextAreaElement).value)" />
            </div>
            <div v-if="moderatorContactEmailError" class="input-error">
                {{ moderatorContactEmailError }}
            </div>
            <div class="input-row">
                <h4 class="input-row-title">
                    Телеграм:
                </h4>
                <input type="text" class="input-field input-field-regular"
                    placeholder="Введите имя пользователя @username" :value="moderatorContactTelegram"
                    @input="setModeratorContactTelegram(($event.target as HTMLTextAreaElement).value)" />
                </div>
                <div v-if="moderatorContactTelegramError" class="input-error">
                    {{ moderatorContactTelegramError }}
                </div>
            <div v-if="moderatorPasswordError" class="input-error">
                {{ moderatorPasswordError }}
            </div>
            <div class="buttons-block">
                <button class="button button-large confirm-moderator-button" :disabled="isLoading" @click="checkInput">
                    Готово
                </button>
                <router-link to="/admin" class="button-large cancel-edit-moderator-button link-style" :class="isLoading ? 'router-link--disabled' : 'button'">
                    Отмена
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default defineComponent({
    data(){
        return{
            isLoading: false as boolean
        }
    },
    computed: {
        ...mapGetters('editModeratorForm', ['moderatorName', 'moderatorEmail', 'moderatorContact', 'moderatorPassword', 'moderatorContactTelegram', 'moderatorContactEmail',
            'moderatorNameError', 'moderatorEmailError', 'moderatorContactError', 'moderatorPasswordError', 'moderatorContactTelegramError', 'moderatorContactEmailError'
        ])
    },
    methods: {
        ...mapMutations('editModeratorForm', ['setModeratorName', 'setModeratorEmail', 'setModeratorContact', 'setModeratorPassword', 'setModeratorContactTelegram', 'setModeratorContactEmail',
            'setModeratorNameError', 'setModeratorEmailError', 'setModeratorContactError', 'setModeratorPasswordError', 'setModeratorContactTelegramError', 'setModeratorContactEmailError'
        ]),
        ...mapActions('editModeratorForm', ['updateModerator']),
        async checkInput() {
            this.isLoading = true
            await this.updateModerator();
            this.isLoading = false
        }
    }
})
</script>

<style>
@import url('EditModeratorForm.css');

.input-row {
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;
}

.confirm-moderator-button {
    background-color: var(--positive-color);
}
</style>