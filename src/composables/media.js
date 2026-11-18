import { ref, computed, watchEffect } from 'vue'

function mediaRef(query) {
	const mq = window.matchMedia(query)
	const matches = ref(mq.matches)
	mq.addEventListener('change', (e) => (matches.value = e.matches))
	return matches
}

// Shared, created once.
export const canHover = mediaRef('(hover: hover) and (pointer: fine)')
export const narrowScreen = mediaRef('(max-width: 640px)')

// Motion follows the system setting until the visitor flips the switch in my footer,
// then their choice wins and is remembered. While it's on, <html> gets the
// `reduce-motion` class, so CSS can use `:root.reduce-motion .thing { ... }`.
const MOTION_KEY = 'motion'
const systemReducedMotion = mediaRef('(prefers-reduced-motion: reduce)')
const motionChoice = ref(loadMotionChoice())

function loadMotionChoice() {
	try {
		const saved = localStorage.getItem(MOTION_KEY)
		return saved === 'reduce' || saved === 'full' ? saved : null
	} catch {
		return null
	}
}

export const reducedMotion = computed(() =>
	motionChoice.value ? motionChoice.value === 'reduce' : systemReducedMotion.value,
)

export function setReducedMotion(on) {
	motionChoice.value = on ? 'reduce' : 'full'
	try {
		localStorage.setItem(MOTION_KEY, motionChoice.value)
	} catch {
		// Storage blocked: the switch still works until the page is closed.
	}
}

watchEffect(() => document.documentElement.classList.toggle('reduce-motion', reducedMotion.value))
