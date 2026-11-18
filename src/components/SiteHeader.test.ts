import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { intersect } from '../test/browser'
import { useFakeClock, wait, pointerEvent, press, byId } from '../test/helpers'

// The header follows the section on screen, which is tracked for the whole page. So each
// test gets fresh copies of everything, on a page with my four sections.
let SiteHeader: typeof import('./SiteHeader.vue').default
let hunt: typeof import('../composables/stacheHunt').hunt

beforeEach(async () => {
	useFakeClock()
	document.body.innerHTML = `<main>${['work', 'experience', 'about', 'contact']
		.map((id) => `<section id="${id}"></section>`)
		.join('')}</main><p id="elsewhere"></p>`
	vi.resetModules()
	SiteHeader = (await import('./SiteHeader.vue')).default
	hunt = (await import('../composables/stacheHunt')).hunt
})

function mountHeader(props: { home?: string; here?: 'work' } = {}) {
	const host = document.createElement('div')
	document.body.prepend(host)
	return mount(SiteHeader, { props, attachTo: host })
}

const links = (wrapper: VueWrapper) => wrapper.findAll('#main-nav-links a')
const toggle = (wrapper: VueWrapper) => wrapper.find('.menu-toggle')
const isOpen = (wrapper: VueWrapper) => toggle(wrapper).attributes('aria-expanded') === 'true'

describe('the menu', () => {
	it('links to each section, in page order', () => {
		const wrapper = mountHeader()
		expect(links(wrapper).map((a) => [a.text(), a.attributes('href')])).toEqual([
			['Work', '#work'],
			['Experience', '#experience'],
			['About', '#about'],
			['Contact', '#contact'],
		])
	})

	it('marks the link for the section you’re in', async () => {
		const wrapper = mountHeader()
		intersect(byId('about'))
		await wait(0)
		const current = links(wrapper).filter((a) => a.attributes('aria-current') === 'location')
		expect(current.map((a) => a.text())).toEqual(['About'])
	})

	it('on a phone, opens from the Menu button and closes with Escape, handing focus back', async () => {
		const wrapper = mountHeader()
		await press(toggle(wrapper), 'touch')
		expect(isOpen(wrapper)).toBe(true)
		await wrapper.find('nav').trigger('keydown', { key: 'Escape' })
		expect(isOpen(wrapper)).toBe(false)
		expect(document.activeElement).toBe(toggle(wrapper).element)
	})

	it('closes when you press somewhere else', async () => {
		const wrapper = mountHeader()
		await press(toggle(wrapper), 'touch')
		await pointerEvent(byId('elsewhere'), 'pointerdown', 'touch')
		expect(isOpen(wrapper)).toBe(false)
	})

	it('closes when you pick a link', async () => {
		const wrapper = mountHeader()
		await press(toggle(wrapper), 'touch')
		await press(links(wrapper)[2], 'touch')
		expect(isOpen(wrapper)).toBe(false)
	})

	it('closes when focus tabs out of it', async () => {
		const wrapper = mountHeader()
		await press(toggle(wrapper), 'touch')
		await wrapper.find('nav').trigger('focusout', { relatedTarget: byId('elsewhere') })
		expect(isOpen(wrapper)).toBe(false)
	})
})

describe('the cousin counter', () => {
	it('counts the cousins found, and links back to the wall', async () => {
		const wrapper = mountHeader()
		const counter = wrapper.find('.hunt')
		expect(counter.text()).toContain('0/5')
		expect(counter.attributes('href')).toBe('#family')
		hunt.find('pencil')
		await wait(0)
		expect(counter.text()).toContain('1/5')
		expect(counter.attributes('title')).toBe('Cousins found: 1 of 5')
	})

	it('gives a little jump for each new find', async () => {
		const wrapper = mountHeader()
		hunt.find('pencil')
		await wait(20)
		expect(wrapper.find('.hunt').classes()).toContain('bump')
		await wait(500)
		expect(wrapper.find('.hunt').classes()).not.toContain('bump')
	})

	it('fills in once everyone is found', async () => {
		const wrapper = mountHeader()
		hunt.cousins.forEach((c) => hunt.find(c.id))
		await wait(0)
		expect(wrapper.find('.hunt').classes()).toContain('done')
	})
})

describe('on a case study’s page', () => {
	it('links back to my home page’s sections, and to my home page from my name', () => {
		const wrapper = mountHeader({ home: '/', here: 'work' })
		expect(links(wrapper).map((a) => a.attributes('href'))).toEqual(['/#work', '/#experience', '/#about', '/#contact'])
		expect(wrapper.find('.brand').attributes('href')).toBe('/')
		expect(wrapper.find('.brand').attributes('aria-label')).toBe('Andrew Stoker, home page')
		expect(wrapper.find('.hunt').attributes('href')).toBe('/#family')
	})

	it('puts the little mustache under the section the page belongs to', async () => {
		const wrapper = mountHeader({ home: '/', here: 'work' })
		await wait(0)
		expect(wrapper.find('.indicator').classes()).toContain('show')
	})
})
