<template>
    <div>
        <AddPhraseForm />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';
import AddPhraseForm from '@/widgets/Forms/AddPhraseForm';

export default defineComponent({
    components: {
        AddPhraseForm
    },
    data() {
        return {
            pageName: 'Добавить' as string
        }
    },
    methods: {
        ...mapMutations(['setPageName']),
        ...mapMutations('phraseForm', ['clearForm'])
    },
    mounted() {
        this.setPageName(this.pageName);
        this.clearForm()
    }
})
</script>

<style>
@import url('AddPhrasePage.css');
</style>