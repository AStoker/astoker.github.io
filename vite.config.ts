/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// astoker.github.io is a user site, so it's served from the root.
export default defineConfig({
	base: '/',
	plugins: [vue()],

	// Vitest: `yarn test`. The fakes in src/test/ stand in for the browser APIs jsdom lacks.
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		restoreMocks: true,
		coverage: {
			include: ['src/**/*.{ts,vue}', 'tools/**/*.ts'],
			exclude: ['src/**/*.test.ts', 'src/test/**', 'src/main.ts', 'src/assets/**', 'src/types.ts'],
		},
	},
})
