<template>
    <div class="login-container">
        <RoleSelectionForm/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';
import RoleSelectionForm from '@/widgets/Forms/RoleSelectionForm';

    export default defineComponent({
        components:{
            RoleSelectionForm
        },
        data() {
            return{
                pageName: 'Авторизация' as string
            }
        },
        methods:{
            ...mapMutations(['setPageName'])
        },
        mounted(){
            this.setPageName(this.pageName)
        }
    })
</script>

<style scoped>
    @import url('RoleSelection.css');
</style>