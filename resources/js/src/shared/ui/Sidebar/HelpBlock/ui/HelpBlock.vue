<template>
    <div class="help-block">
        <p class="help-text">
            Помогите нам дополнить базу знаний новыми выражениями
        </p>
        <router-link to="/add" class="button button-large help-button-side">
            Добавить выражение
        </router-link>
    </div>    
</template>

<script lang="ts">
import { defineComponent } from 'vue';

    export default defineComponent({
        
    })
</script>

<style scoped>
    @import url('HelpBlock.css');
</style>