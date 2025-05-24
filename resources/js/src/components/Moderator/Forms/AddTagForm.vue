<template>
    <div class="add-tag-form">
        Добавить новый тег:
        <div class="add-tag-input">
            <div class="tag tag-generic">
                <input type="text" placeholder="Новый тег" class="input-field input-field-regular">
            </div>
            <button class="button button-large add-tag-button">Добавить</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

    export default defineComponent({

    })
</script>

<style scoped>
    .add-tag-form{
            position: sticky;
            top: 100px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-family: var(--default-header-font-family);
        padding: 6px;
        font-size: 20px;
        background-color: var(--light-meaning-block-color);
        border-radius: var(--default-border-radius);
        width: fit-content;
        height: fit-content;
        font-weight: 500;
        grid-area: 'add-tag';
    }

    .add-tag-input{
        display: flex;
        gap: 10px;
        align-items:flex-end;
    }

    .add-tag-button{
        background-color: var(--button-color);;
    }
</style>