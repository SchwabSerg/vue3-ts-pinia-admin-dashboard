import { createApp } from 'vue';
import '@/assets/main.css';
import App from '@/App.vue';
import { pinia } from '@/app/providers/pinia';
import { router } from '@/app/providers/router';
import { registerGuards } from '@/app/router/guards';

async function bootstrap(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  } else if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { setupFetchInterceptor } = await import('./mocks/fetchInterceptor');
    setupFetchInterceptor();
  }

  registerGuards(router);
  const app = createApp(App);
  app.use(pinia);
  app.use(router);
  await router.isReady();
  app.mount('#app');
}

bootstrap().catch(console.error);
