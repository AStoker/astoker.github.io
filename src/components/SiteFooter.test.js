import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteFooter from './SiteFooter.vue'
import { reducedMotion } from '../composables/media.js'
import { press } from '../test/helpers.js'

describe('the Reduce motion switch', () => {
	it('turns motion off and on, and says which it is', async () => {
		const wrapper = mount(SiteFooter, { attachTo: document.body })
		const toggle = wrapper.find('.motion')
		expect(toggle.attributes('aria-pressed')).toBe('false')
		await press(toggle)
		expect(reducedMotion.value).toBe(true)
		expect(toggle.attributes('aria-pressed')).toBe('true')
		await press(toggle)
		expect(reducedMotion.value).toBe(false)
	})

	it('shares the footer with the sleeping Walrus', () => {
		const wrapper = mount(SiteFooter)
		expect(wrapper.find('.napper').exists()).toBe(true)
	})
})
