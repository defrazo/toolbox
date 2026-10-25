import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
	plugins: [react(), svgr(), tailwindcss()],
	resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
	server: {
		host: '0.0.0.0',
		port: 3001,
		strictPort: true,
		proxy: {
			'/api': { target: 'http://localhost:8001', changeOrigin: true },
			'/sanctum': { target: 'http://localhost:8001', changeOrigin: true },
			'/auth/onemate': { target: 'http://localhost:8001', changeOrigin: true },
			'/login': {
				target: 'http://localhost:8001',
				changeOrigin: true,
				bypass(req) {
					if (req.method === 'GET') return '/index.html';
				},
			},
			'/logout': {
				target: 'http://localhost:8001',
				changeOrigin: true,
				bypass(req) {
					if (req.method === 'GET') return '/index.html';
				},
			},
		},
	},
});
