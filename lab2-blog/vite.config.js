import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 子路径部署：CI 注入 GH_PAGES_BASE=/se3306-exp2/blog/
  base: process.env.GH_PAGES_BASE || '/',
  server: { port: 5174 }
});
