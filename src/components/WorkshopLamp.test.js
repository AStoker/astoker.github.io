import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WorkshopLamp from './WorkshopLamp.vue'
import StacheCharacter from './StacheCharacter.vue'
import { hunt } from '../composables/stacheHunt.js'
import { setReducedMotion } from '../composables/media.js'
import { useFakeClock, wait, press } from '../test/helpers.js'

function mountLamp() {
	return mount(WorkshopLamp, { props: { id: 'dali' }, attachTo: document.body })
}

const isLit = (wrapper) => wrapper.find('.workshop').classes('lit')
const dali = (wrapper) => wrapper.find('button.dali')
const mood = (wrapper) => wrapper.findComponent(StacheCharacter).props('mood')

beforeEach(useFakeClock)

describe('WorkshopLamp', () => {
	it('starts in the dark, with the cousin out of reach', () => {
		const wrapper = mountLamp()
		expect(isLit(wrapper)).toBe(false)
		expect(wrapper.find('.cord').attributes('aria-pressed')).toBe('false')
		expect(dali(wrapper).attributes('tabindex')).toBe('-1')
		expect(dali(wrapper).attributes('aria-hidden')).toBe('true')
	})

	it('pulling the cord turns the lamp on and tells the page', async () => {
		const wrapper = mountLamp()
		await press(wrapper.find('.cord'))
		expect(isLit(wrapper)).toBe(true)
		expect(wrapper.emitted('update:lit')).toEqual([[true]])
		expect(dali(wrapper).attributes('tabindex')).toBe('0')
		expect(dali(wrapper).attributes('aria-hidden')).toBeUndefined()
	})

	it('clicking the lamp itself works too', async () => {
		const wrapper = mountLamp()
		await press(wrapper.find('.lamp'))
		expect(isLit(wrapper)).toBe(true)
	})

	it('the cousin gets a fright in the light, then settles', async () => {
		const wrapper = mountLamp()
		await press(wrapper.find('.cord'))
		expect(mood(wrapper)).toBe('surprised')
		await wait(900)
		expect(mood(wrapper)).toBe('idle')
	})

	it('pulling again puts it back in the dark', async () => {
		const wrapper = mountLamp()
		await press(wrapper.find('.cord'))
		await press(wrapper.find('.cord'))
		expect(isLit(wrapper)).toBe(false)
		expect(mood(wrapper)).toBe('idle')
		expect(wrapper.emitted('update:lit')).toEqual([[true], [false]])
	})

	it('the cord gives a little tug', async () => {
		const wrapper = mountLamp()
		await press(wrapper.find('.cord'))
		await wait(20)
		expect(wrapper.find('.pull').classes()).toContain('tugging')
		await wait(450)
		expect(wrapper.find('.pull').classes()).not.toContain('tugging')
	})

	it('no tug with motion reduced', async () => {
		setReducedMotion(true)
		const wrapper = mountLamp()
		await press(wrapper.find('.cord'))
		await wait(20)
		expect(wrapper.find('.pull').classes()).not.toContain('tugging')
	})

	it('clicking the cousin in the light finds it', async () => {
		const wrapper = mountLamp()
		await press(wrapper.find('.cord'))
		await press(dali(wrapper))
		expect(hunt.isFound('dali')).toBe(true)
		expect(dali(wrapper).attributes('aria-label')).toContain('The Dalí. You already found this one')
	})
})
