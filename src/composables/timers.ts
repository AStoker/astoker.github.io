import { ref, onBeforeUnmount, type Ref } from 'vue'

/** A set of timeouts and animation frames that cancel together. See {@link useTimers}. */
export interface Timers {
	/** Run `fn` after `ms` milliseconds. */
	after(ms: number, fn: () => void): void
	/** Run `fn` on the next animation frame. */
	nextFrame(fn: () => void): void
	/** Cancel everything this set has scheduled and not yet run. */
	clear(): void
}

/**
 * Timeouts and animation frames that clean up after themselves. Everything still waiting is
 * cancelled when the component goes away, so nothing fires on a component that's gone.
 *
 * Call it once per independent sequence: `clear()` only cancels what that one scheduled.
 * Must be called during a component's setup.
 */
export function useTimers(): Timers {
	const timeouts = new Set<ReturnType<typeof setTimeout>>()
	const frames = new Set<number>()

	function after(ms: number, fn: () => void) {
		const id = setTimeout(() => {
			timeouts.delete(id)
			fn()
		}, ms)
		timeouts.add(id)
	}

	function nextFrame(fn: () => void) {
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

/** A CSS animation that can be played again. See {@link useReplay}. */
export interface Replay {
	/** True while the animation should be playing: bind it to the class that runs it. */
	playing: Ref<boolean>
	/** Play the animation from the start, even if it's halfway through. */
	play(): void
}

/**
 * A CSS animation I can play again, even halfway through: `playing` switches off, then
 * back on a frame later so the animation restarts, then off once `ms` is up.
 *
 * ```ts
 * const { playing: tugging, play: tug } = useReplay(450)
 * // <g :class="{ tugging }">
 * ```
 *
 * @param ms How long the animation lasts.
 */
export function useReplay(ms: number): Replay {
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
