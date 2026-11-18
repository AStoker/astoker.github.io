// Small helpers my tests share.
import { vi } from 'vitest'
import { nextTick, defineComponent, h } from 'vue'
import { mount, type DOMWrapper, type VueWrapper } from '@vue/test-utils'
import { hunt } from '../composables/stacheHunt'
import type { CousinId } from '../types'

/** Something to fire an event at: an element, or a Vue Test Utils wrapper around one. */
type Target = Element | DOMWrapper<Element>

const element = (target: Target) => (target instanceof Element ? target : target.element)

/**
 * Fake clocks for everything my components time with: timeouts, animation frames and
 * `performance.now()`. Call it before mounting, so the component picks up the fakes.
 */
export function useFakeClock() {
	vi.useFakeTimers({
		toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'],
	})
}

/** Move the fake clock on, then let Vue update the page. */
export async function wait(ms: number) {
	await vi.advanceTimersByTimeAsync(ms)
	await nextTick()
}

/** A pointer event, as a mouse, finger or pen would send it. */
export async function pointerEvent(target: Target, type: string, pointerType = 'mouse') {
	element(target).dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerType }))
	await nextTick()
}

/** A full press: pointerdown, then the click it turns into (`detail: 1`, as a real click has). */
export async function press(target: Target, pointerType = 'mouse') {
	await pointerEvent(target, 'pointerdown', pointerType)
	element(target).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
	await nextTick()
}

/** Find every cousin except the ones named, without waiting for anyone to react. */
export function findAllExcept(...ids: CousinId[]) {
	for (const cousin of hunt.cousins) if (!ids.includes(cousin.id)) hunt.find(cousin.id)
}

/**
 * Run a composable inside a real, mounted component, so its lifecycle hooks work.
 * Returns what the composable returned, plus the wrapper to unmount it with.
 */
export function withSetup<T>(composable: () => T): { result: T; wrapper: VueWrapper } {
	let result!: T
	const wrapper = mount(
		defineComponent({
			setup() {
				result = composable()
				return () => h('div')
			},
		}),
		{ attachTo: document.body },
	)
	return { result, wrapper }
}

/** An element by id, or a clear failure if the test page doesn't have it. */
export function byId(id: string): HTMLElement {
	const el = document.getElementById(id)
	if (!el) throw new Error(`No #${id} on the test page`)
	return el
}
