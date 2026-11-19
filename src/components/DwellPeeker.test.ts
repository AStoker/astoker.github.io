import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import DwellPeeker from './DwellPeeker.vue'
import { hunt } from '../composables/stacheHunt'
import { setReducedMotion } from '../composables/media'
import { intersect, observing } from '../test/browser'
import { useFakeClock, wait, press } from '../test/helpers'

function mountPencil(props = {}) {
	return mount(DwellPeeker, {
		props: { id: 'pencil', seconds: 3, ...props },
		slots: { default: '<dl class="facts"><div><dt>Based in</dt><dd>Columbia, SC</dd></div></dl>' },
		attachTo: document.body,
	})
}

const spot = (wrapper: VueWrapper) => wrapper.find('.dweller')
const isUp = (wrapper: VueWrapper) => spot(wrapper).classes('up')

// The space it rises into scrolls fully into view (or partly, or out).
const onScreen = (wrapper: VueWrapper, intersectionRatio = 1) =>
	intersect(spot(wrapper).element, { isIntersecting: intersectionRatio > 0, intersectionRatio })

beforeEach(useFakeClock)

describe('DwellPeeker', () => {
	it('sits on the top edge of whatever it’s given, where I put it', () => {
		const wrapper = mountPencil({ at: '80%' })
		expect(wrapper.find('.facts').text()).toContain('Columbia, SC')
		expect(wrapper.find('.ledge').attributes('style')).toContain('--at: 80%')
		expect(observing(spot(wrapper).element)).toBe(true)
	})

	it('stays out of sight, and out of the tab order, until its edge is on screen', () => {
		const wrapper = mountPencil()
		const button = wrapper.find('.peeker')
		expect(isUp(wrapper)).toBe(false)
		expect(button.attributes('tabindex')).toBe('-1')
		expect(button.attributes('aria-hidden')).toBe('true')
	})

	it('rises once the space above its edge is fully on screen, taking `seconds` to get there', async () => {
		const wrapper = mountPencil()
		onScreen(wrapper)
		await wait(0)
		expect(isUp(wrapper)).toBe(true)
		expect(wrapper.find('.ledge').attributes('style')).toContain('--rise: 3s')
		expect(wrapper.find('.peeker').attributes('tabindex')).toBe('0')
	})

	it('waits while it’s only partly on screen, say under my header', async () => {
		const wrapper = mountPencil()
		onScreen(wrapper, 0.5)
		await wait(0)
		expect(isUp(wrapper)).toBe(false)
	})

	it('ducks straight back down when you scroll away', async () => {
		const wrapper = mountPencil()
		onScreen(wrapper)
		await wait(0)
		onScreen(wrapper, 0)
		await wait(0)
		expect(isUp(wrapper)).toBe(false)
	})

	it('with motion reduced, waits the whole time and then simply appears', async () => {
		setReducedMotion(true)
		const wrapper = mountPencil()
		onScreen(wrapper)
		await wait(2900)
		onScreen(wrapper) // still there; this mustn't start the wait over
		await wait(100)
		expect(isUp(wrapper)).toBe(true)
	})

	it('with motion reduced, leaving before the time is up cancels it', async () => {
		setReducedMotion(true)
		const wrapper = mountPencil()
		onScreen(wrapper)
		await wait(1000)
		onScreen(wrapper, 0)
		await wait(5000)
		expect(isUp(wrapper)).toBe(false)
	})

	it('clicking it finds it', async () => {
		const wrapper = mountPencil()
		onScreen(wrapper)
		await wait(0)
		await press(wrapper.find('.peeker'))
		expect(hunt.isFound('pencil')).toBe(true)
	})
})
