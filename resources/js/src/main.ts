import { createApp } from "vue";
import App from "@/app/App.vue";
import router from "@/app/router";
import store from "@/app/store";

const script = document.createElement('script');
script.id = 'turnstile-script';
script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
script.async = true;
script.defer = true;
document.head.appendChild(script);

createApp(App).use(store).use(router).mount("#app");
