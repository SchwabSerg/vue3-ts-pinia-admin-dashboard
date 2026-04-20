import { createApp } from 'vue';
import '@/assets/main.css';
import App from '@/App.vue';
import { env, isDev } from '@/app/config/env';
import { pinia } from '@/app/providers/pinia';
import { router } from '@/app/providers/router';
import { registerGuards } from '@/app/router/guards';

if (isDev || env.enableMsw) {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations
          .filter((r: ServiceWorkerRegistration) => {
            const url = r.active?.scriptURL ?? r.installing?.scriptURL ?? r.waiting?.scriptURL ?? '';
            return url.includes('mockServiceWorker.js');
          })
          .map((r: ServiceWorkerRegistration) => r.update()),
      );
    }

    const { worker } = await import('./mocks/browser');
    await Promise.race([
      worker.start({ onUnhandledRequest: 'bypass' }),
      new Promise<void>((resolve) => setTimeout(resolve, 3000)),
    ]);
  } catch (e) {
    console.warn('[MSW] Failed to start, continuing without mocks:', e);
  }
}

registerGuards(router);

const app = createApp(App);

app.use(pinia);
app.use(router);

await router.isReady();

app.mount('#app');
