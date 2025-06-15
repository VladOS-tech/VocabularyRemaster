<template>
    <div class="user-phrase-block">
        <p class="user-post-date">
            {{dateToString(PhraseData.date)}}
        </p>
        <h2>{{ PhraseData.content }}</h2>
        <div class="tags-block">
            <div class="tag tag-generic" v-for="tag in PhraseData.tags" :key="tag.id">{{ tag.content }}</div>
        </div>
        <h3>Значение:</h3>
        <div class="user-meaning-block">
            <h4>{{PhraseData.meanings}}</h4>
            <div class="user-separator"/>
            <p class="user-meaning-example-text" v-for="(context, index) in PhraseData.contexts" :key="index">
                "{{context.content}}"
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PhraseObject from '@/shared/types/PhraseObject';

    export default defineComponent({
        props:{
            PhraseData: {
                type: Object as PropType<PhraseObject>,
                required: true
            }
        },
        methods:{
            dateToString(date: Date): string{
                if (!date) return "Неизвестно";
                let newDate: RegExpMatchArray | null = date.toString().match(/^(\d{4})-(\d{2})-(\d{2}).*/)
                return `${newDate?.[3]}.${newDate?.[2]}.${newDate?.[1]}`
            }
        }
    })
</script>

<style scoped>
    @import url('PhraseStyle.css');
</style>