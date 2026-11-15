import { ref } from 'vue'

function mediaRef(query) {
	const mq = typeof window !== 'undefined' ? window.matchMedia(query) : null
	const r = ref(mq ? mq.matches : false)
	mq?.addEventListener('change', (e) => (r.value = e.matches))
	return r
}

// Shared, created once.
export const reducedMotion = mediaRef('(prefers-reduced-motion: reduce)')
export const canHover = mediaRef('(hover: hover) and (pointer: fine)')
export const narrowScreen = mediaRef('(max-width: 640px)')
