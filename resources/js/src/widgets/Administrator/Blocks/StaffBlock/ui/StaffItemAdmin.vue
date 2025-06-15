<template>
    <div class="staff-block">
        <h2>{{ StaffData.name }} <span
                :class="StaffData.online_status ? 'moderator-online' : 'moderator-offline'">•</span></h2>
        <div class="staff-data-row">
            <h3>Почта:</h3>
            <div v-if="StaffData.login_email !== null" class="staff-data-field">
                {{ StaffData.login_email }}
            </div>
            <div v-else class="staff-data-field-empty">
                —
            </div>
        </div>
        <div class="staff-data-row" v-if="StaffData.notification_email">
            <h3>Контактная почта:</h3>
            <div class="staff-data-field">
                {{ StaffData.notification_email }}
            </div>
        </div>
        <div class="staff-data-row" v-if="StaffData.telegram_chat_id">
            <h3>Телеграм:</h3>
            <div class="staff-data-field">
                {{ StaffData.telegram_chat_id }}
            </div>
        </div>
        <div class="admin-staff-button">
            <button class="button button-large remove-phrase-button" @click="removeModerator" :disabled="isLoading">
                Удалить
            </button>
            <router-link :to="`/admin/edit-moderator/${StaffData.id}`"
                class="link-style button button-large review-button">
                Изменить данные
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ModeratorObject from '@/shared/types/ModeratorObject';
import { mapActions } from 'vuex';

export default defineComponent({
    props: {
        StaffData: {
            type: Object as PropType<ModeratorObject>,
            required: true
        }
    },
    data() {
        return {
            isLoading: false as boolean
        }
    },
    methods: {
        ...mapActions(['removeModeratorRequest']),
        async removeModerator() {
            this.isLoading = true
            await this.removeModeratorRequest({ id: this.StaffData.id })
        }
    }
})
</script>

<style scoped>
@import url('StaffItem.css');

.moderator-online {
    color: #7FED7C;
}

.moderator-offline {
    color: #FF3D3D;
}
</style>