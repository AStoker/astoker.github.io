// Checks that what I write in content.js fits together, so a typo shows up here rather
// than as a broken page.
import { describe, it, expect } from 'vitest'
import { cousins, sections, family, profile } from './content.js'
import { MUSTACHES } from './assets/mustaches.js'

describe('cousins', () => {
	it('each has a unique id', () => {
		const ids = cousins.map((c) => c.id)
		expect(new Set(ids).size).toBe(ids.length)
	})

	it.each(cousins.map((c) => [c.id, c]))('%s wears a real mustache and has all its words', (id, cousin) => {
		expect(MUSTACHES).toHaveProperty(cousin.kind)
		for (const field of ['name', 'clue', 'found', 'label']) expect(cousin[field], field).toMatch(/\S/)
	})

	it('fit the portrait wall: a 3 × 3 grid with my frame taking four squares', () => {
		expect(cousins).toHaveLength(9 - 4)
	})

	it('all wear a different mustache from mine and each other', () => {
		const kinds = [family.me.kind, ...cousins.map((c) => c.kind)]
		expect(new Set(kinds).size).toBe(kinds.length)
	})
})

describe('sections', () => {
	it('each has a unique id, a title and a menu label', () => {
		const ids = sections.map((s) => s.id)
		expect(new Set(ids).size).toBe(ids.length)
		for (const section of sections) {
			expect(section.title).toMatch(/\S/)
			expect(section.menu).toMatch(/\S/)
		}
	})
})

describe('profile', () => {
	it('has a way to get in touch', () => {
		expect(profile.email || profile.linkedin || profile.github).toBeTruthy()
	})
})
