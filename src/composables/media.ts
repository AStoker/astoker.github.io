import { ref, computed, watchEffect, type Ref } from 'vue'

function mediaRef(query: string): Readonly<Ref<boolean>> {
	const mq = window.matchMedia(query)
	const matches = ref(mq.matches)
	mq.addEventListener('change', (e) => (matches.value = e.matches))
	return matches
}

/** True on a device with a mouse or trackpad, which can hover. */
export const canHover = mediaRef('(hover: hover) and (pointer: fine)')
/** True on a phone-sized window (640px wide or less). */
export const narrowScreen = mediaRef('(max-width: 640px)')

// Motion follows the system setting until the visitor flips the switch in my footer,
// then their choice wins and is remembered.
type MotionChoice = 'reduce' | 'full'
const MOTION_KEY = 'motion'
const systemReducedMotion = mediaRef('(prefers-reduced-motion: reduce)')
const motionChoice = ref<MotionChoice | null>(loadMotionChoice())

function loadMotionChoice(): MotionChoice | null {
	try {
		const saved = localStorage.getItem(MOTION_KEY)
		return saved === 'reduce' || saved === 'full' ? saved : null
	} catch {
		return null
	}
}

/**
 * True when motion should be kept to a minimum: the system setting, unless the visitor has
 * used the switch in my footer. While it's on, `<html>` has the `reduce-motion` class, so
 * CSS can use `:root.reduce-motion .thing { ... }`.
 */
export const reducedMotion = computed(() =>
	motionChoice.value ? motionChoice.value === 'reduce' : systemReducedMotion.value,
)

/** The footer switch: reduce motion (or don't), whatever the system says, and remember it. */
export function setReducedMotion(on: boolean) {
	motionChoice.value = on ? 'reduce' : 'full'
	try {
		localStorage.setItem(MOTION_KEY, motionChoice.value)
	} catch {
		// Storage blocked: the switch still works until the page is closed.
	}
}

watchEffect(() => document.documentElement.classList.toggle('reduce-motion', reducedMotion.value))
