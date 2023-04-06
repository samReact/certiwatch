import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  return {
    plugins: [react(), eslint()],
    server: {
      proxy: {
        '/api': {
          target: isDev
            ? 'http://localhost:5000'
            : 'https://certiwatch.vercel.app',
          changeOrigin: isDev,
          secure: !isDev
        }
      }
    }
  };
});
