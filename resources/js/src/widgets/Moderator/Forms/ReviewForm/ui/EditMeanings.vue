<template>
    <div class="input-meanings-block">
        <div class="input-meaning-block">
            <!--   -->
            <h3>
                Значение:
            </h3>
            <textarea ref="'meaning'+ index" type="text" class="input-field input-field-regular input-field-textarea"
                placeholder="Введите значение фразеологизма..." @input="heightResize" rows="1"
                v-model="meaning"></textarea>

            <div class="input-error" v-if="inputMeaningError">
                {{ inputMeaningError }}
            </div>
            <h3>
                Применения:
            </h3>
            <div class="input-example-container" v-for="(example, index) in examples" :key="index">
                <div class="input-example-block">
                    <textarea type="text" class="input-field input-field-regular input-field-textarea"
                        placeholder="Приведите пример использования для текущего значения..."
                        @input="heightResize($event); setExample(index, ($event.target as HTMLTextAreaElement)?.value)"
                        @blur="console.log('')" rows="1" :value="example"></textarea>
                    <button class="button delete-button button-large" v-if="examples.length > 1"
                        @click="removeExample(index);">
                        <img src="@/shared/assets/images/trash-icon.svg" alt="delete">
                    </button>
                </div>
                <div class="input-error" v-if="inputExamplesErrors[index]">
                    {{ inputExamplesErrors[index] }}
                </div>
            </div>
            <button class="button button-large add-meaning-button" v-if="examples.length < 5" @click="addExample();">
                <img src="@/shared/assets/images/plus-icon.svg" alt="plus">
                Новое применение
            </button>
            <!-- <div class="input-error">
            {{inputMeaningsErrors.at(index)?.example}}
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import MeaningObject from '@/assets/types/MeaningObject';
import { mapGetters, mapMutations } from 'vuex';
import { nextTick } from 'vue';

export default defineComponent({
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters('reviewForm', ['inputMeaningError', 'inputMeaning', 'inputExamples', 'inputExamplesErrors']),
        meaning: {
            get(): string {
                return this.inputMeaning
            },
            set(value: string) {
                this.setInputMeaning(value)
            }
        },
        examples(): string[] {
            return this.inputExamples
        }
    },
    methods: {
        ...mapMutations('reviewForm', ['setInputMeaning', 'setInputMeaningError', 'addInputExample', 'removeInputExample', 'setInputExample']),
        heightResize(e: Event) {
            console.log('a')
            const textField = e.target as HTMLTextAreaElement
            textField.style.height = '0px';
            textField.style.height = textField.scrollHeight + 'px'
        },
        addExample() {
            this.addInputExample()
        },
        removeExample(index: number) {
            this.removeInputExample(index)
            nextTick(() => {
                this.recalculateExampleHeights();
            });
        },
        setExample(index: number, value: string) {
            this.setInputExample({ index: index, example: value })
        },
        recalculateExampleHeights() {
            const textAreas = document.querySelectorAll('.input-example-block textarea');
            textAreas.forEach((el) => {
                const textArea = el as HTMLTextAreaElement;
                textArea.style.height = '0px';
                textArea.style.height = textArea.scrollHeight + 'px';
            });
        }

    },
    // beforeMount(){
    //     this.setInputMeanings([{meaning: '', example: ''}])
    //     this.setInputMeaningsErrors([{meaning: '', example: ''}])
    // }
})

</script>

<style scoped>
@import url('InputMeanings.css');
</style>