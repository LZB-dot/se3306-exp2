import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 是「用户名.github.io/仓库名/」子路径部署，
  // 构建时由 CI 注入 GH_PAGES_BASE，本地开发则为 '/'
  base: process.env.GH_PAGES_BASE || '/',
  server: { port: 5173 }
});
