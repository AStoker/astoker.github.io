import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import HidingStache from './HidingStache.vue'
import StacheCharacter from './StacheCharacter.vue'
import { hunt } from '../composables/stacheHunt'
import { intersect, setMedia, MEDIA } from '../test/browser'
import { useFakeClock, wait, pointerEvent, press } from '../test/helpers'

function mountSpot(props = {}) {
	return mount(HidingStache, {
		props: { id: 'handlebar', ...props },
		slots: { default: '<div class="card">A case study</div>' },
		attachTo: document.body,
	})
}

const peeking = (wrapper: VueWrapper) => wrapper.find('.spot').classes('peeking')
const escape = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

beforeEach(useFakeClock)

describe('HidingStache', () => {
	it('hides behind whatever it’s given, with a label for screen readers', () => {
		const wrapper = mountSpot()
		expect(wrapper.find('.card').text()).toBe('A case study')
		expect(peeking(wrapper)).toBe(false)
		expect(wrapper.find('.peeker').attributes('aria-label')).toBe('Someone is hiding here. Click to find them.')
	})

	it('comes out while the mouse is over it, and ducks back a moment after it leaves', async () => {
		const wrapper = mountSpot()
		await pointerEvent(wrapper.find('.spot'), 'pointerenter')
		expect(peeking(wrapper)).toBe(true)
		await pointerEvent(wrapper.find('.spot'), 'pointerleave')
		await wait(300)
		expect(peeking(wrapper)).toBe(true)
		await wait(50)
		expect(peeking(wrapper)).toBe(false)
	})

	it('comes out with a tap, and goes back with another', async () => {
		const wrapper = mountSpot()
		await press(wrapper.find('.card'), 'touch')
		expect(peeking(wrapper)).toBe(true)
		await press(wrapper.find('.card'), 'touch')
		await wait(0)
		expect(peeking(wrapper)).toBe(false)
	})

	it('a mouse click on the card doesn’t toggle it (hovering already did)', async () => {
		const wrapper = mountSpot()
		await press(wrapper.find('.card'), 'mouse')
		expect(peeking(wrapper)).toBe(false)
	})

	it('clicking the cousin finds it, and it stays out until it’s done celebrating', async () => {
		const wrapper = mountSpot()
		await pointerEvent(wrapper.find('.spot'), 'pointerenter')
		await press(wrapper.find('.peeker'))
		expect(hunt.isFound('handlebar')).toBe(true)
		await pointerEvent(wrapper.find('.spot'), 'pointerleave')
		await wait(1000)
		expect(peeking(wrapper)).toBe(true)
		await wait(800)
		expect(peeking(wrapper)).toBe(false)
		expect(wrapper.find('.peeker').attributes('aria-label')).toContain('You already found this one')
	})

	it('Escape sends a hover-peek back', async () => {
		const wrapper = mountSpot()
		await pointerEvent(wrapper.find('.spot'), 'pointerenter')
		escape()
		await wait(0)
		expect(peeking(wrapper)).toBe(false)
	})

	it('stays out with Escape while it has keyboard focus, since it’s the thing focused', async () => {
		const wrapper = mountSpot()
		wrapper.find<HTMLButtonElement>('.peeker').element.focus()
		await wait(0)
		expect(peeking(wrapper)).toBe(true)
		escape()
		await wait(0)
		expect(peeking(wrapper)).toBe(true)
	})

	it('goes back into hiding once it’s scrolled out of view', async () => {
		const wrapper = mountSpot()
		await pointerEvent(wrapper.find('.spot'), 'pointerenter')
		intersect(wrapper.find('.spot').element, { isIntersecting: false })
		await wait(0)
		expect(peeking(wrapper)).toBe(false)
	})

	it('leans round a side edge, and its eyes know about the lean', () => {
		const wrapper = mountSpot({ from: 'left' })
		expect(wrapper.find('.spot').classes()).toContain('from-left')
		expect(wrapper.find('.spot').attributes('style')).toContain('--lean: -8deg')
		expect(wrapper.findComponent(StacheCharacter).props('rotation')).toBe(-8)
	})

	it('comes over the top instead on a phone, where a side peek would poke off the screen', async () => {
		setMedia(MEDIA.narrow, true)
		const wrapper = mountSpot({ from: 'right' })
		expect(wrapper.find('.spot').classes()).toContain('from-top')
		expect(wrapper.findComponent(StacheCharacter).props('rotation')).toBe(0)
	})
})
