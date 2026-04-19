import { createApp } from 'vue';
import '@/assets/main.css';
import App from '@/App.vue';
import { env, isDev } from '@/app/config/env';
import { pinia } from '@/app/providers/pinia';
import { router } from '@/app/providers/router';
import { registerGuards } from '@/app/router/guards';

if (isDev || env.enableMsw) {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();

    await Promise.all(
      registrations
        .filter((registration: ServiceWorkerRegistration): boolean => {
          const scriptUrl = registration.active?.scriptURL ?? registration.installing?.scriptURL ?? registration.waiting?.scriptURL ?? '';

          return scriptUrl.includes('mockServiceWorker.js');
        })
        .map(async (registration: ServiceWorkerRegistration): Promise<void> => {
          await registration.update();
        }),
    );
  }

  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

registerGuards(router);

const app = createApp(App);

app.use(pinia);
app.use(router);

await router.isReady();

app.mount('#app');
