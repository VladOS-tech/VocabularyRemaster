<template>
    <div class="login-form login-form-light">
        <h2>
            Выберите свою роль
        </h2>
        <div class="separator-line" />
        <div class="form-row">
        <button class="button button-large login-button">
            Модератор
        </button>
        <button class="button button-large login-button">
            Администратор
        </button>
    </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {

        }
    },
    methods: {

    }
})
</script>

<style scoped>
@import url('RoleSelectionForm.css');
    .form-row{
        display: flex;
        justify-content: center;
        gap: 10px;
    }
</style>