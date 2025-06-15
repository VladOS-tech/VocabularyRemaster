<template>
    <div class="request-item">
        <p class="request-date">
            {{dateToString(RequestData.date)}}
        </p>
        <h2>{{ RequestData.content }}</h2>
        <div class="review-button-container">
            <router-link :to="`/moderator/approval/${RequestData.id}`" class="link-style button button-large review-button">Рассмотреть</router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PhraseObject from '@/shared/types/PhraseObject';

    export default defineComponent({
        props:{
            RequestData: {
                type: Object as PropType<PhraseObject>,
                required: true
            }
        },
        methods:{
            dateToString(date: Date): string{
                let newDate: RegExpMatchArray | null = date.toString().match(/^(\d{4})-(\d{2})-(\d{2}).*/)
                return `${newDate?.[3]}.${newDate?.[2]}.${newDate?.[1]}`
            }
        }
    })
</script>

<style scoped>
    @import url('PhraseStyle.css');
</style>