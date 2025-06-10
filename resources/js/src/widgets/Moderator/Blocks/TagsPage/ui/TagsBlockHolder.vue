<template>
    <LoadingIcon v-if="isLoading"/>
</template>

<script lang="ts">
import LoadingIcon from '@/components/Misc/LoadingIcon.vue';
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';

export default defineComponent({
    components:{
        LoadingIcon
    },
    data() {
        return {
            isLoading: true as boolean
        }
    },
    methods: {
        ...mapMutations(['setTabName'])
    },
    mounted() {
        this.setTabName('tags')
        setTimeout(() => {
            this.isLoading = false
        }, 1000);
    }
})
</script>

<style scoped></style>