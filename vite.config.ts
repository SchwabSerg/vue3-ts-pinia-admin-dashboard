import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const viteEnv: Record<string, string> = loadEnv(mode, process.cwd(), '');
  const devServerPort: number = Number(viteEnv.VITE_DEV_SERVER_PORT || '5173');

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: devServerPort,
    },
  };
});
