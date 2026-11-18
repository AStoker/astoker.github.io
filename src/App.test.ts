// The whole page at once: does everything mount, and is every cousin hidden somewhere?
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'
import HidingStache from './components/HidingStache.vue'
import DwellPeeker from './components/DwellPeeker.vue'
import WorkshopLamp from './components/WorkshopLamp.vue'
import NappingStache from './components/NappingStache.vue'
import { cousins, sections } from './content'
import { caseStudies } from './caseStudies'

function mountPage() {
	return mount(App, { attachTo: document.body })
}

describe('the page', () => {
	it('hides every cousin exactly once', () => {
		const wrapper = mountPage()
		const hidden = [HidingStache, DwellPeeker, WorkshopLamp, NappingStache]
			.flatMap((spot) => wrapper.findAllComponents(spot))
			.map((spot) => spot.props('id'))
		expect(hidden.sort()).toEqual(cousins.map((c) => c.id).sort())
	})

	it('has every section the menu links to, in order', () => {
		const wrapper = mountPage()
		const onPage = wrapper.findAll('main > section.section').map((s) => s.attributes('id'))
		expect(onPage).toEqual(sections.map((s) => s.id))
	})

	it('shows each case study as a card linking to its page, then placeholders', () => {
		const wrapper = mountPage()
		const slots = wrapper.findAll('#work .slots > li')
		expect(slots.length).toBe(Math.max(3, caseStudies.length))
		caseStudies.forEach((study, i) => {
			expect(slots[i]?.find('.card h3 a').attributes('href')).toBe(`/work/${study.slug}/`)
		})
		for (const slot of slots.slice(caseStudies.length)) expect(slot.find('.slot').exists()).toBe(true)
	})

	it('starts with a skip link to the main content', () => {
		const wrapper = mountPage()
		const skip = wrapper.find('.skip-link')
		expect(skip.text()).toBe('Skip to content')
		expect(skip.attributes('href')).toBe('#main')
		expect(wrapper.find('main#main').exists()).toBe(true)
	})

	it('offers my resume from the top and from Experience', () => {
		const wrapper = mountPage()
		const downloads = wrapper.findAll('a[download]')
		expect(downloads).toHaveLength(2)
		for (const link of downloads) expect(link.attributes('href')).toBe('/andrew-stoker-resume.pdf')
	})
})
