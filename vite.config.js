import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// astoker.github.io is a user site, so it's served from the root.
export default defineConfig({
	base: '/',
	plugins: [vue()],
})
