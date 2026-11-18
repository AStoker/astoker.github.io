import { ref, onBeforeUnmount } from 'vue'

// Timeouts and animation frames that clean up after themselves. Everything still waiting
// is cancelled when the component goes away, so nothing fires on a component that's gone.
// Call it once per independent sequence: clear() only cancels what that one scheduled.
export function useTimers() {
	const timeouts = new Set()
	const frames = new Set()

	function after(ms, fn) {
		const id = setTimeout(() => {
			timeouts.delete(id)
			fn()
		}, ms)
		timeouts.add(id)
	}

	function nextFrame(fn) {
		const id = requestAnimationFrame(() => {
			frames.delete(id)
			fn()
		})
		frames.add(id)
	}

	function clear() {
		timeouts.forEach(clearTimeout)
		frames.forEach(cancelAnimationFrame)
		timeouts.clear()
		frames.clear()
	}

	onBeforeUnmount(clear)
	return { after, nextFrame, clear }
}

// A CSS animation I can play again, even halfway through: `playing` switches off, then
// back on a frame later so the animation restarts, then off once `ms` is up.
//
//   const { playing: tugging, play: tug } = useReplay(450)
//   <g :class="{ tugging }">
export function useReplay(ms) {
	const playing = ref(false)
	const timers = useTimers()

	function play() {
		timers.clear()
		playing.value = false
		timers.nextFrame(() => {
			playing.value = true
			timers.after(ms, () => (playing.value = false))
		})
	}

	return { playing, play }
}
