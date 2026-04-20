import { createApp } from 'vue';
import '@/assets/main.css';
import App from '@/App.vue';
import { pinia } from '@/app/providers/pinia';
import { router } from '@/app/providers/router';
import { registerGuards } from '@/app/router/guards';

registerGuards(router);

const app = createApp(App);
app.use(pinia);
app.use(router);

if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === 'true') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({ onUnhandledRequest: 'bypass' }).catch(console.warn);
  }).catch(console.warn);
}

router.isReady().then(() => {
  app.mount('#app');
}).catch(console.warn);
