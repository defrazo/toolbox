import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
	base: '/',
	plugins: [react(), svgr(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	build: {
		outDir: 'dist',
	},
	server: {
		host: '0.0.0.0',
		port: 3000,
		open: true,
		hmr: {
			host: '192.168.31.168',
			port: 3000,
			clientPort: 3000,
		},
		proxy: {
			'/sanctum': {
				target: 'http://localhost:8000',
				changeOrigin: true,
			},
			'/login': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				bypass(req) {
					if (req.method === 'GET') return '/index.html';
				},
			},
			'/logout': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				bypass(req) {
					if (req.method === 'GET') {
						return '/index.html';
					}
				},
			},
			'/api': {
				target: 'http://localhost:8000',
				changeOrigin: true,
			},
		},
	},
});
