import { describe, it, expect, vi } from 'vitest'
import { hunt } from './stacheHunt'
import { cousins } from '../content'

const STORAGE_KEY = 'stache-hunt:v2'
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')

describe('the hunt', () => {
	it('starts with nobody found', () => {
		expect(hunt.count).toBe(0)
		expect(hunt.total).toBe(cousins.length)
		expect(hunt.complete).toBe(false)
		expect(hunt.lastFound).toBe(null)
	})

	it('finds a cousin once', () => {
		expect(hunt.find('walrus')).toBe(true)
		expect(hunt.find('walrus')).toBe(false)
		expect(hunt.count).toBe(1)
		expect(hunt.isFound('walrus')).toBe(true)
		expect(hunt.lastFound?.name).toBe('The Walrus')
	})

	it('is complete once everyone is found', () => {
		cousins.forEach((c) => hunt.find(c.id))
		expect(hunt.complete).toBe(true)
	})

	it('remembers who’s been found', () => {
		hunt.find('dali')
		hunt.find('pencil')
		expect(saved()).toEqual(['dali', 'pencil'])
	})

	it('reset() hides everyone again and forgets them', () => {
		hunt.find('dali')
		hunt.reset()
		expect(hunt.count).toBe(0)
		expect(hunt.lastFound).toBe(null)
		expect(saved()).toEqual([])
	})

	it('counts requests to hide them again', () => {
		const before = hunt.hideRequests
		hunt.requestHide()
		expect(hunt.hideRequests).toBe(before + 1)
	})

	it('can’t be changed from outside except through its methods', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		// @ts-expect-error: the types say no, too
		hunt.lastFound = cousins[0]
		// @ts-expect-error
		hunt.cousins.push(cousins[0])
		expect(hunt.lastFound).toBe(null)
		expect(hunt.cousins).toHaveLength(cousins.length)
		expect(warn).toHaveBeenCalled()
	})

	it('looks cousins up by id', () => {
		expect(hunt.cousin('horseshoe').name).toBe('The Horseshoe')
	})
})

describe('loading saved progress', () => {
	async function freshHunt() {
		vi.resetModules()
		return (await import('./stacheHunt')).hunt
	}

	it('picks up where the visitor left off', async () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(['handlebar', 'walrus']))
		const saved = await freshHunt()
		expect(saved.count).toBe(2)
		expect(saved.isFound('walrus')).toBe(true)
	})

	it('drops cousins that no longer exist', async () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(['handlebar', 'goatee']))
		expect((await freshHunt()).count).toBe(1)
	})

	it('starts over if what’s saved is broken', async () => {
		localStorage.setItem(STORAGE_KEY, '{not json')
		expect((await freshHunt()).count).toBe(0)
		localStorage.setItem(STORAGE_KEY, '"walrus"')
		expect((await freshHunt()).count).toBe(0)
	})
})
