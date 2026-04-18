import { createApp } from 'vue';
import App from '@/App.vue';
import { pinia } from '@/app/providers/pinia';
import { router } from '@/app/providers/router';
import { registerGuards } from '@/app/router/guards';

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

registerGuards(router);

createApp(App).use(pinia).use(router).mount('#app');
