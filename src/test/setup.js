// Runs before every test file. The browser fakes have to come first: media.js asks
// matchMedia questions the moment it's imported.
import './browser.js'
import { beforeEach, afterEach, vi } from 'vitest'
import { enableAutoUnmount } from '@vue/test-utils'
import { resetMedia } from './browser.js'
import { hunt, wallCaptionInView } from '../composables/stacheHunt.js'
import { pointer } from '../composables/pointer.js'
import { setReducedMotion } from '../composables/media.js'

// Unmount whatever a test mounted before anything else is reset, so no component reacts
// to the clean-up.
let unmountAll
enableAutoUnmount((fn) => (unmountAll = fn))

beforeEach(() => {
	localStorage.clear()
})

afterEach(() => {
	unmountAll?.()
	vi.useRealTimers()
	hunt.reset()
	wallCaptionInView.value = false
	Object.assign(pointer, { x: 0, y: 0, has: false, lastMove: 0, type: 'mouse' })
	setReducedMotion(false)
	resetMedia()
	localStorage.clear()
	document.body.innerHTML = ''
})
