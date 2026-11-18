import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import NappingStache from './NappingStache.vue'
import StacheCharacter from './StacheCharacter.vue'
import { hunt } from '../composables/stacheHunt'
import { useFakeClock, wait, press } from '../test/helpers'

function mountNapper() {
	return mount(NappingStache, { props: { id: 'walrus' }, attachTo: document.body })
}

const face = (wrapper: VueWrapper) => wrapper.findComponent(StacheCharacter)

beforeEach(useFakeClock)

describe('NappingStache', () => {
	it('is asleep in plain sight', () => {
		const wrapper = mountNapper()
		expect(wrapper.find('.napper').classes()).toContain('asleep')
		expect(face(wrapper).props('mood')).toBe('sleep')
		expect(wrapper.find('.napper').attributes('aria-label')).toBe('Someone is asleep here. Click to wake them up.')
	})

	it('waking it finds it: a start, a happy twirl, then back to sleep', async () => {
		const wrapper = mountNapper()
		await press(wrapper.find('.napper'))
		expect(hunt.isFound('walrus')).toBe(true)
		expect(face(wrapper).props('mood')).toBe('surprised')
		expect(wrapper.find('.napper').classes()).not.toContain('asleep')
		await wait(600)
		expect(face(wrapper).props('mood')).toBe('happy')
		expect(face(wrapper).props('twirl')).toBe(1)
		await wait(1600)
		expect(face(wrapper).props('mood')).toBe('sleep')
	})

	it('once found, waking it again just makes it grumpy', async () => {
		hunt.find('walrus')
		const wrapper = mountNapper()
		await press(wrapper.find('.napper'))
		expect(face(wrapper).props('mood')).toBe('surprised')
		await wait(900)
		expect(face(wrapper).props('mood')).toBe('sleep')
		expect(face(wrapper).props('twirl')).toBe(0)
	})
})
