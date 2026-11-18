import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import StacheCharacter from './StacheCharacter.vue'
import type { MustacheKind } from '../assets/mustaches'
import { pointer } from '../composables/pointer'
import { setReducedMotion } from '../composables/media'
import { intersect } from '../test/browser'
import { useFakeClock, wait } from '../test/helpers'

function mountFace(props = {}) {
	return mount(StacheCharacter, { props, attachTo: document.body })
}

const svg = (wrapper: VueWrapper) => wrapper.find('svg')
const LEFT_EYE_X = 45
const pupilX = (wrapper: VueWrapper) => Number(wrapper.find('.pupil').attributes('cx')) - LEFT_EYE_X
const pupilY = (wrapper: VueWrapper) => Number(wrapper.find('.pupil').attributes('cy')) + 7

beforeEach(useFakeClock)

describe('the face', () => {
	it('uses the same box for every kind by default, so hiding spots line up', () => {
		const boxes = (['chevron', 'handlebar', 'walrus'] as const).map((kind) => svg(mountFace({ kind })).attributes('viewBox'))
		expect(new Set(boxes).size).toBe(1)
	})

	it('grows the box to show the whole face when asked', () => {
		const width = (kind: MustacheKind) =>
			Number(svg(mountFace({ kind, fit: 'face' })).attributes('viewBox')?.split(' ')[2])
		expect(width('handlebar')).toBeGreaterThan(width('chevron'))
	})

	it.each([
		['idle', true],
		['surprised', true],
		['curious', true],
		['happy', false],
		['sleep', false],
	])('%s: eyes open is %s', (mood, open) => {
		const wrapper = mountFace({ mood })
		expect(wrapper.findAll('.eye-open')).toHaveLength(open ? 2 : 0)
		expect(svg(wrapper).classes()).toContain(`is-${mood}`)
	})
})

describe('the eyes', () => {
	it('look where they’re told', async () => {
		const wrapper = mountFace({ look: 'left' })
		intersect(svg(wrapper).element)
		await wait(500)
		expect(pupilX(wrapper)).toBeLessThan(-3)
		expect(Math.abs(pupilY(wrapper))).toBeLessThan(0.1)
	})

	it('follow the pointer', async () => {
		pointer.has = true
		pointer.x = 500
		pointer.y = 0
		const wrapper = mountFace()
		intersect(svg(wrapper).element)
		pointer.lastMove = performance.now()
		await wait(500)
		expect(pupilX(wrapper)).toBeGreaterThan(3)
	})

	it('follow the pointer correctly when the character is turned round', async () => {
		pointer.has = true
		pointer.x = 500
		pointer.y = 0
		const wrapper = mountFace({ rotation: 180 })
		intersect(svg(wrapper).element)
		pointer.lastMove = performance.now()
		await wait(500)
		expect(pupilX(wrapper)).toBeLessThan(-3)
	})

	it('only move while the character is on screen', async () => {
		const wrapper = mountFace({ look: 'left' })
		await wait(500)
		expect(pupilX(wrapper)).toBe(0)
	})

	it('blink every few seconds', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.5)
		const wrapper = mountFace()
		await wait(2200 + 0.5 * 4200)
		expect(svg(wrapper).classes()).toContain('blinking')
		await wait(130)
		expect(svg(wrapper).classes()).not.toContain('blinking')
	})

	it('hold still with motion reduced', async () => {
		setReducedMotion(true)
		const wrapper = mountFace()
		for (let i = 0; i < 20; i++) {
			await wait(500)
			expect(svg(wrapper).classes()).not.toContain('blinking')
		}
	})

	// This used to leave a blink loop running forever on a character that was gone.
	it('stop blinking for good when the character goes away mid-blink', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.5)
		const wrapper = mountFace()
		await wait(2200 + 0.5 * 4200)
		expect(svg(wrapper).classes()).toContain('blinking')
		wrapper.unmount()
		await wait(10000)
		expect(vi.getTimerCount()).toBe(0)
	})
})

describe('the twirl', () => {
	it('twirls each time the number goes up', async () => {
		const wrapper = mountFace()
		await wrapper.setProps({ twirl: 1 })
		await wait(20)
		expect(svg(wrapper).classes()).toContain('twirling')
		await wait(1000)
		expect(svg(wrapper).classes()).not.toContain('twirling')
	})

	it('doesn’t twirl with motion reduced', async () => {
		setReducedMotion(true)
		const wrapper = mountFace()
		await wrapper.setProps({ twirl: 1 })
		await wait(20)
		expect(svg(wrapper).classes()).not.toContain('twirling')
	})
})
