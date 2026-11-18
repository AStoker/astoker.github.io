/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Full file names: Vite is moving to loading this config with Node itself, which needs them.
import { caseStudyPages } from './tools/caseStudyPages.ts'
import { caseStudies } from './src/caseStudies/index.ts'

const SITE = 'https://astoker.github.io'

// astoker.github.io is a user site, so it's served from the root.
export default defineConfig({
	base: '/',
	// caseStudyPages: a real page at /work/<slug>/ for each case study (see the tool)
	plugins: [vue(), caseStudyPages(caseStudies, SITE, 'Andrew Stoker')],

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
