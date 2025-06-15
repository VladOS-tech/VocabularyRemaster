<template>
  <div ref="turnstileEl" class="cf-turnstile"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          theme?: string;
        }
      ) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export default defineComponent({
  props: {
    sitekey: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: 'light',
    },
    onSuccess: {
      type: Function as PropType<(token: string) => void>,
      required: true,
    },
  },
  mounted() {
    this.renderTurnstile();
  },
  methods: {
    async loadTurnstileScript(): Promise<void> {
      if (window.turnstile) return;

      const existing = document.getElementById('turnstile-script');
      if (existing) {
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            if (window.turnstile) {
              clearInterval(interval);
              resolve();
            }
          }, 50);
        });
      }

      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'turnstile-script';
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
        script.async = true;
        script.defer = true;
        window.onTurnstileLoad = () => resolve();
        document.head.appendChild(script);
      });
    },

    async renderTurnstile() {
      await this.loadTurnstileScript();
      const el = this.$refs.turnstileEl as HTMLElement | undefined;
      if (el && window.turnstile) {
        el.innerHTML = '';
        window.turnstile.render(el, {
          sitekey: this.sitekey,
          callback: this.onSuccess,
          theme: this.theme,
        });
      }
    },
  },
});
</script>

<!-- <style scoped>
.cf-turnstile {
  margin-top: 20px;
}
</style> -->
