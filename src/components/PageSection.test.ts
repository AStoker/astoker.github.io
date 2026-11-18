import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageSection from './PageSection.vue'
import { sections, work, about, contact } from '../content'

describe('PageSection', () => {
	it('is numbered by its place in `sections`', () => {
		const numbers = sections.map((section) => mount(PageSection, { props: { section } }).find('.section-num').text())
		expect(numbers).toEqual(['01', '02', '03', '04'])
	})

	it('is a landmark named by its heading, with the id the menu links to', () => {
		const wrapper = mount(PageSection, { props: { section: contact } })
		const section = wrapper.find('section')
		expect(section.attributes('id')).toBe('contact')
		const heading = wrapper.find(`#${section.attributes('aria-labelledby')}`)
		expect(heading.element.tagName).toBe('H2')
		expect(heading.text()).toBe('Say hello')
	})

	it('puts the note beside the heading, and the rest underneath', () => {
		const wrapper = mount(PageSection, {
			props: { section: work },
			slots: { note: '<p>A note</p>', default: '<div class="body">The rest</div>' },
		})
		expect(wrapper.find('.section-head .section-note').text()).toBe('A note')
		expect(wrapper.find('section > .body').text()).toBe('The rest')
	})

	it('leaves the note out when there isn’t one', () => {
		expect(mount(PageSection, { props: { section: about } }).find('.section-note').exists()).toBe(false)
	})
})
