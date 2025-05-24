<template>
    <div class="phrase-block phrase-block-light">
        <p class="post-date post-date-light">
            {{dateToString(PhraseData.date)}}
        </p>
        <h2>{{ PhraseData.content }}</h2>
        <div class="tags-block">
            <div class="tag tag-generic" v-for="tag in PhraseData.tags" :key="tag.id">{{ tag.content }}</div>
        </div>
        <h3>Значение</h3>
        <div class="meaning-block meaning-block-light">
            <h4>{{PhraseData.meaning}}</h4>
            <p class="meaning-example-text" v-for="context in PhraseData.contexts" :key="context.id">
                "{{context.content}}"
            </p>
        </div>
        <div class="moder-phrase-button">
            <button class="button button-large remove-phrase-button" @click="requestDeletion" :disabled="PhraseData.status === 'deletion_requested'">
                Запросить удаление
            </button>
            <div class="deletion-requested" v-if="PhraseData.status === 'deletion_requested'">
                Удаление запрошено
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PhraseObject from '@/assets/types/PhraseObject';
import { mapActions } from 'vuex';

    export default defineComponent({
        props:{
            PhraseData: {
                type: Object as PropType<PhraseObject>,
                required: true
            }
        },
        data(){
            return{
                isLoading: false as boolean
            }
        },
        methods:{
            ...mapActions(['requestPhraseDeletion']),
            dateToString(date: Date): string{
                let newDate: RegExpMatchArray | null = date.toString().match(/^(\d{4})-(\d{2})-(\d{2}).*/)
                return `${newDate?.[3]}.${newDate?.[2]}.${newDate?.[1]}`
            },
            async requestDeletion(){
                this.isLoading = true
                await this.requestPhraseDeletion({phraseId: this.PhraseData.id})
                this.isLoading = false
            }
        }
    })
</script>

<style scoped>
    @import url('@/assets/style/elements/phrase-style.css');
    @import url('@/assets/style/moderator/elements/phrase-item.css');

    .deletion-requested{
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>