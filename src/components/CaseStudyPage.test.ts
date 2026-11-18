import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CaseStudyPage from './CaseStudyPage.vue'
import NappingStache from './NappingStache.vue'
import { caseStudies } from '../caseStudies'
import type { CaseStudy } from '../caseStudies'

const [study] = caseStudies as [CaseStudy]

function mountPage(which: CaseStudy = study) {
	return mount(CaseStudyPage, { props: { study: which }, attachTo: document.body })
}

describe('a case study’s page', () => {
	it('is titled with the study’s name, once', () => {
		const wrapper = mountPage()
		expect(wrapper.findAll('h1').map((h) => h.text())).toEqual([study.title])
		expect(document.title).toBe(`${study.title} · Andrew Stoker`)
	})

	it('labels each part of the story, numbering the decisions', () => {
		const wrapper = mountPage()
		const labels = wrapper.findAll('.part-label').map((p) => p.text())
		expect(labels[0]).toBe('The goal')
		expect(labels.filter((l) => l.startsWith('Decision'))).toEqual(
			study.story.filter((s) => s.part === 'decision').map((_, i) => `Decision ${i + 1}`),
		)
		expect(labels.at(-1)).toBe('What’s next')
	})

	it('gives every part a heading the section is named by', () => {
		const wrapper = mountPage()
		for (const section of wrapper.findAll('section.part')) {
			const heading = section.find(`#${section.attributes('aria-labelledby')}`)
			expect(heading.element.tagName).toBe('H2')
		}
	})

	it('shows every picture with its description, the cover first and the rest lazily', () => {
		const wrapper = mountPage()
		const images = wrapper.findAll('img')
		expect(images[0]?.attributes('alt')).toBe(study.cover.alt)
		expect(images[0]?.attributes('loading')).toBeUndefined()
		expect(images.slice(1).every((img) => img.attributes('loading') === 'lazy')).toBe(true)
		expect(images.every((img) => img.attributes('alt'))).toBe(true)
	})

	it('says when a link opens a new tab', () => {
		const wrapper = mountPage()
		const external = wrapper.findAll('a[target="_blank"]')
		expect(external.length).toBe(study.links?.length ?? 0)
		for (const link of external) expect(link.text()).toContain('(opens in a new tab)')
	})

	it('links back to my home page from the header, the top and the end', () => {
		const wrapper = mountPage()
		const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
		expect(hrefs).toContain('/#work')
		expect(hrefs).toContain('/#contact')
		expect(wrapper.find('.brand').attributes('href')).toBe('/')
	})

	it('leaves the Walrus at home: the cousins only hide on my home page', () => {
		expect(mountPage().findComponent(NappingStache).exists()).toBe(false)
	})
})
