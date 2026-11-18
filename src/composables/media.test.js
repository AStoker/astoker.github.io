import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { setMedia, MEDIA } from '../test/browser.js'

// media.js reads the system settings and saved choice when it's imported, so each test
// gets a fresh copy.
async function freshMedia() {
	vi.resetModules()
	return import('./media.js')
}

const htmlHasClass = () => document.documentElement.classList.contains('reduce-motion')

describe('reduced motion', () => {
	it('follows the system setting until the visitor chooses', async () => {
		const { reducedMotion } = await freshMedia()
		expect(reducedMotion.value).toBe(false)
		setMedia(MEDIA.reducedMotion, true)
		expect(reducedMotion.value).toBe(true)
	})

	it('the footer switch wins over the system setting', async () => {
		setMedia(MEDIA.reducedMotion, true)
		const { reducedMotion, setReducedMotion } = await freshMedia()
		setReducedMotion(false)
		expect(reducedMotion.value).toBe(false)
		setMedia(MEDIA.reducedMotion, true)
		expect(reducedMotion.value).toBe(false)
	})

	it('remembers the visitor’s choice', async () => {
		const first = await freshMedia()
		first.setReducedMotion(true)
		expect(localStorage.getItem('motion')).toBe('reduce')
		const later = await freshMedia()
		expect(later.reducedMotion.value).toBe(true)
	})

	it('ignores a saved choice it doesn’t recognise', async () => {
		localStorage.setItem('motion', 'sideways')
		setMedia(MEDIA.reducedMotion, true)
		const { reducedMotion } = await freshMedia()
		expect(reducedMotion.value).toBe(true)
	})

	it('puts the reduce-motion class on <html> for CSS to use', async () => {
		const { setReducedMotion } = await freshMedia()
		setReducedMotion(true)
		await nextTick()
		expect(htmlHasClass()).toBe(true)
		setReducedMotion(false)
		await nextTick()
		expect(htmlHasClass()).toBe(false)
	})

	it('still works when storage is blocked', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked')
		})
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('blocked')
		})
		const { reducedMotion, setReducedMotion } = await freshMedia()
		setReducedMotion(true)
		expect(reducedMotion.value).toBe(true)
	})
})

describe('other media queries', () => {
	it('canHover and narrowScreen follow the window', async () => {
		const { canHover, narrowScreen } = await freshMedia()
		setMedia(MEDIA.hover, true)
		setMedia(MEDIA.narrow, true)
		expect(canHover.value).toBe(true)
		expect(narrowScreen.value).toBe(true)
	})
})
