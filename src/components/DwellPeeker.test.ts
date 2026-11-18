import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { intersect } from '../test/browser'
import { useFakeClock, wait, press, byId } from '../test/helpers'

// The Pencil watches which section is on screen, and that tracker is shared by the whole
// page. So each test gets fresh copies of everything, on a page with two sections.
let DwellPeeker: typeof import('./DwellPeeker.vue').default
let hunt: typeof import('../composables/stacheHunt').hunt
let setReducedMotion: typeof import('../composables/media').setReducedMotion

beforeEach(async () => {
	useFakeClock()
	document.body.innerHTML = '<main><section id="work"></section><section id="about"></section></main>'
	vi.resetModules()
	DwellPeeker = (await import('./DwellPeeker.vue')).default
	hunt = (await import('../composables/stacheHunt')).hunt
	setReducedMotion = (await import('../composables/media')).setReducedMotion
})

const section = byId

function mountPencil() {
	const host = document.createElement('div')
	section('about').append(host)
	return mount(DwellPeeker, { props: { id: 'pencil', section: 'about', seconds: 3 }, attachTo: host })
}

const isUp = (wrapper: VueWrapper) => wrapper.find('.dweller').classes('up')

describe('DwellPeeker', () => {
	it('stays out of sight, and out of the tab order, until you’re in its section', () => {
		const wrapper = mountPencil()
		const button = wrapper.find('.peeker')
		expect(isUp(wrapper)).toBe(false)
		expect(button.attributes('tabindex')).toBe('-1')
		expect(button.attributes('aria-hidden')).toBe('true')
	})

	it('rises while its section is in the middle of the screen, taking `seconds` to get there', async () => {
		const wrapper = mountPencil()
		intersect(section('about'))
		await wait(0)
		expect(isUp(wrapper)).toBe(true)
		expect(wrapper.find('.dweller').attributes('style')).toContain('--rise: 3s')
		expect(wrapper.find('.peeker').attributes('tabindex')).toBe('0')
	})

	it('ignores other sections', async () => {
		const wrapper = mountPencil()
		intersect(section('work'))
		await wait(0)
		expect(isUp(wrapper)).toBe(false)
	})

	it('ducks straight back down when you scroll away', async () => {
		const wrapper = mountPencil()
		intersect(section('about'))
		await wait(0)
		intersect(section('about'), { isIntersecting: false })
		await wait(0)
		expect(isUp(wrapper)).toBe(false)
	})

	it('with motion reduced, waits the whole time and then simply appears', async () => {
		setReducedMotion(true)
		const wrapper = mountPencil()
		intersect(section('about'))
		await wait(2900)
		expect(isUp(wrapper)).toBe(false)
		await wait(100)
		expect(isUp(wrapper)).toBe(true)
	})

	it('with motion reduced, leaving before the time is up cancels it', async () => {
		setReducedMotion(true)
		const wrapper = mountPencil()
		intersect(section('about'))
		await wait(1000)
		intersect(section('about'), { isIntersecting: false })
		await wait(5000)
		expect(isUp(wrapper)).toBe(false)
	})

	it('clicking it finds it', async () => {
		const wrapper = mountPencil()
		intersect(section('about'))
		await wait(0)
		await press(wrapper.find('.peeker'))
		expect(hunt.isFound('pencil')).toBe(true)
	})
})
