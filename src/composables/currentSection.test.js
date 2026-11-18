import { describe, it, expect, beforeEach, vi } from 'vitest'
import { intersect, observing } from '../test/browser.js'
import { withSetup } from '../test/helpers.js'

// The section tracker is shared by the whole page, so each test gets a fresh copy.
async function setUp() {
	document.body.innerHTML = `
		<main>
			<section id="work"></section>
			<section id="about"></section>
			<div><section id="nested"></section></div>
		</main>`
	vi.resetModules()
	const { useCurrentSection } = await import('./currentSection.js')
	return useCurrentSection
}

const section = (id) => document.getElementById(id)

let useCurrentSection
beforeEach(async () => {
	useCurrentSection = await setUp()
})

describe('useCurrentSection', () => {
	it('watches the page’s top-level sections once it’s mounted', () => {
		withSetup(useCurrentSection)
		expect(observing(section('work'))).toBe(true)
		expect(observing(section('about'))).toBe(true)
		expect(observing(section('nested'))).toBe(false)
	})

	it('is the section in the middle of the screen, or null between sections', () => {
		const { result: current } = withSetup(useCurrentSection)
		expect(current.value).toBe(null)
		intersect(section('work'))
		expect(current.value).toBe('work')
		intersect(section('work'), { isIntersecting: false })
		expect(current.value).toBe(null)
	})

	it('doesn’t forget the current section when another one leaves', () => {
		const { result: current } = withSetup(useCurrentSection)
		intersect(section('work'))
		intersect(section('about'))
		intersect(section('work'), { isIntersecting: false })
		expect(current.value).toBe('about')
	})

	it('shares one answer between everyone who asks', () => {
		const first = withSetup(useCurrentSection).result
		const second = withSetup(useCurrentSection).result
		intersect(section('about'))
		expect(first).toBe(second)
		expect(second.value).toBe('about')
	})
})
