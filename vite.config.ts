import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const keyPath = './certs/localhost+1-key.pem';
  const certPath = './certs/localhost+1.pem';
  const hasCerts = fs.existsSync(keyPath) && fs.existsSync(certPath);

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      https: hasCerts ? {
        key:  fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      } : undefined,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
