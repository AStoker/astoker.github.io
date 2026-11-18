import { describe, it, expect, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useFrameSelection } from './frameSelection.js'
import { pointer } from './pointer.js'
import { useFakeClock, wait, withSetup } from '../test/helpers.js'

// A wall with two frames, and something outside it.
function setUp() {
	document.body.innerHTML = `
		<section id="wall"><button id="a"></button><button id="b"></button></section>
		<button id="outside"></button>`
	const wall = ref(document.getElementById('wall'))
	const { result } = withSetup(() => useFrameSelection(wall))
	return result
}

const mouse = (type = 'pointerenter') => new PointerEvent(type, { pointerType: 'mouse' })
const touch = (type = 'pointerenter') => new PointerEvent(type, { pointerType: 'touch' })
const click = (detail = 1) => ({ detail })
const el = (id) => document.getElementById(id)

beforeEach(useFakeClock)

describe('hovering', () => {
	it('chooses a frame once the mouse settles on it', async () => {
		const s = setUp()
		s.hover('a', mouse())
		await wait(100)
		expect(s.active.value).toBe(null)
		await wait(10)
		expect(s.active.value).toBe('a')
	})

	it('ignores a frame the mouse only brushes past', async () => {
		const s = setUp()
		s.hover('a', mouse())
		await wait(50)
		s.unhover()
		await wait(200)
		expect(s.active.value).toBe(null)
	})

	it('ignores touch, which has no hover', async () => {
		const s = setUp()
		s.hover('a', touch())
		await wait(200)
		expect(s.active.value).toBe(null)
	})
})

describe('leaving the wall', () => {
	it('goes back to the intro a moment after the mouse leaves', async () => {
		const s = setUp()
		s.select('a')
		s.wallEvents.pointerleave(mouse('pointerleave'))
		await wait(599)
		expect(s.active.value).toBe('a')
		await wait(1)
		expect(s.active.value).toBe(null)
	})

	it('stays if the mouse comes straight back', async () => {
		const s = setUp()
		s.select('a')
		s.wallEvents.pointerleave(mouse('pointerleave'))
		await wait(300)
		s.wallEvents.pointerenter(mouse('pointerenter'))
		await wait(600)
		expect(s.active.value).toBe('a')
	})

	it('goes back when focus moves off the wall, but not between frames', () => {
		const s = setUp()
		s.select('a')
		s.wallEvents.focusout({ relatedTarget: el('b') })
		expect(s.active.value).toBe('a')
		s.wallEvents.focusout({ relatedTarget: el('outside') })
		expect(s.active.value).toBe(null)
	})

	it('goes back on a click anywhere else on the page', async () => {
		const s = setUp()
		s.select('a')
		el('b').click()
		expect(s.active.value).toBe('a')
		el('outside').click()
		await nextTick()
		expect(s.active.value).toBe(null)
	})
})

describe('tapping and clicking', () => {
	it('a tap shows a frame, and a second tap puts it away', () => {
		const s = setUp()
		pointer.type = 'touch'
		s.choose('a', click())
		expect(s.active.value).toBe('a')
		s.choose('a', click())
		expect(s.active.value).toBe(null)
	})

	it('a tap on another frame switches to it', () => {
		const s = setUp()
		pointer.type = 'touch'
		s.choose('a', click())
		s.choose('b', click())
		expect(s.active.value).toBe('b')
	})

	it('a mouse click never puts a frame away (the mouse chose it by hovering)', () => {
		const s = setUp()
		s.choose('a', click())
		s.choose('a', click())
		expect(s.active.value).toBe('a')
	})

	it('Enter or Space on a frame never puts it away', () => {
		const s = setUp()
		pointer.type = 'touch' // even if the last press was a tap
		s.choose('a', click(0))
		s.choose('a', click(0))
		expect(s.active.value).toBe('a')
	})
})

describe('focusing', () => {
	it('chooses a frame the keyboard moves to', () => {
		const s = setUp()
		el('a').focus() // jsdom treats this as keyboard focus (:focus-visible)
		s.focus('a', { target: el('a') })
		expect(s.active.value).toBe('a')
	})

	// Android focuses a button when it's tapped. If that counted, the tap's own click would
	// find the frame already chosen and put it straight away again.
	it('ignores the focus a tap gives a button', () => {
		const s = setUp()
		const tapped = { matches: (selector) => selector !== ':focus-visible' }
		s.focus('a', { target: tapped })
		expect(s.active.value).toBe(null)
		pointer.type = 'touch'
		s.choose('a', click())
		expect(s.active.value).toBe('a')
	})
})
