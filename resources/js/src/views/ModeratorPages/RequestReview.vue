<template>
    <div>{{ id }}</div>
    <ReviewForm/>
</template>

<script lang="ts">
import ReviewForm from '@/components/Moderator/Forms/ReviewForm.vue';
import { defineComponent } from 'vue';

    export default defineComponent({
        components: {
            ReviewForm
        },
        props: {
            id: {
                type: String,
                required: true
            }
        }
    })
</script>

<style>
    @import url('@/assets/style/pages/add-phrase.css');
</style>