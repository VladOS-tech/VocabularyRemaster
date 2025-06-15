<template>
  <router-view name="nav"></router-view>
  <router-view></router-view>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';
export default defineComponent({
  mounted() {
    if (window.innerWidth <= 768) {
      this.setMobile(true)
    }
    else this.setMobile(false)
    this.loadUser()
    
    const scriptId = 'turnstile-script';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  },
  methods: {
    ...mapMutations(['setToken', 'setUsername', 'setUserRole', 'setMobile']),
    loadUser() {
      const token = localStorage.getItem('token') as string
      const username = localStorage.getItem('username') as string
      const role = localStorage.getItem('role') as string
      this.setToken(token)
      this.setUsername(username)
      this.setUserRole(role)
    }
  }
})
</script>

<style>
@import url("global-styles.css");
</style>
