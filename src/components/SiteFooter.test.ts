import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteFooter from './SiteFooter.vue'
import { reducedMotion } from '../composables/media'
import { tracking } from '../composables/tracking'
import { tracking as words } from '../content'
import { press } from '../test/helpers'

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

describe('the note about Clarity', () => {
	it('opens and closes', async () => {
		const wrapper = mount(SiteFooter, { attachTo: document.body })
		const button = wrapper.find('.tracking-note-button')
		const note = wrapper.find('#tracking-note')
		expect(note.isVisible()).toBe(false)
		await press(button)
		expect(button.attributes('aria-expanded')).toBe('true')
		expect(note.isVisible()).toBe(true)
		expect(note.text()).toContain(words.note[1])
		await press(button)
		expect(note.isVisible()).toBe(false)
	})

	it('has a switch to turn the tracking off and back on', async () => {
		const wrapper = mount(SiteFooter, { attachTo: document.body })
		const toggle = wrapper.find('.tracking-switch')
		expect(toggle.attributes('aria-pressed')).toBe('true')
		await press(toggle)
		expect(tracking.value).toBe(false)
		expect(toggle.attributes('aria-pressed')).toBe('false')
		await press(toggle)
		expect(tracking.value).toBe(true)
	})
})
