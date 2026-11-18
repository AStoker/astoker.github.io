// Small helpers my tests share.
import { vi } from 'vitest'
import { nextTick, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { hunt } from '../composables/stacheHunt.js'

// Fake clocks for everything my components time with: timeouts, animation frames and
// performance.now(). Call it before mounting, so the component picks up the fakes.
export function useFakeClock() {
	vi.useFakeTimers({
		toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'],
	})
}

// Move the fake clock on, then let Vue update the page.
export async function wait(ms) {
	await vi.advanceTimersByTimeAsync(ms)
	await nextTick()
}

// A pointer event, as a mouse, finger or pen would send it.
export async function pointerEvent(el, type, pointerType = 'mouse') {
	const target = el.element ?? el
	target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerType }))
	await nextTick()
}

// A full press: pointerdown, then the click it turns into. `detail` is 1 for a real click
// and 0 for one the keyboard made.
export async function press(el, pointerType = 'mouse') {
	const target = el.element ?? el
	await pointerEvent(target, 'pointerdown', pointerType)
	target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
	await nextTick()
}

// Find every cousin except the ones named, without waiting for anyone to react.
export function findAllExcept(...ids) {
	for (const cousin of hunt.cousins) if (!ids.includes(cousin.id)) hunt.find(cousin.id)
}

// Run a composable inside a real (mounted) component, so its lifecycle hooks work.
// Returns what the composable returned, plus the wrapper to unmount it with.
export function withSetup(composable, options = {}) {
	let result
	const wrapper = mount(
		defineComponent({
			setup() {
				result = composable()
				return () => h('div')
			},
		}),
		{ attachTo: document.body, ...options },
	)
	return { result, wrapper }
}
