import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { defineConfig, loadEnv } from 'vite';

const createConfig = ({ mode }: { mode: string }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return defineConfig({
		plugins: [vue(), svgLoader()],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '',
				},
			},
		},
		server: {
			port: 8080,
			proxy: {
				'/api': {
					target: '',
					changeOrigin: true,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
						'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
					},
				},
			},
		},
		build: {
			chunkSizeWarningLimit: 1000,
			cssCodeSplit: false,
			sourcemap: mode === 'build' ? 'hidden' : false,
			rollupOptions: {
				output: {
					compact: true,
				},
			},
		},
	});
};

export default createConfig;
