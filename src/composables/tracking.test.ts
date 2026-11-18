import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import Clarity from '@microsoft/clarity'
import { tracking, setTracking, startTracking } from './tracking'
import { withSetup } from '../test/helpers'

// Stand in for Clarity, so no test loads the real script. (A spy rather than vi.mock: my test
// setup has already imported tracking.ts, and with it the real package, by the time this runs.)
beforeEach(() => {
	for (const call of ['init', 'consent', 'consentV2'] as const) vi.spyOn(Clarity, call).mockImplementation(() => {})
})

/** Start tracking the way the live site does, inside a component so it cleans up after. */
function startLive() {
	withSetup(() => startTracking(true))
}

describe('Clarity on the live site', () => {
	it('starts for everyone, with no consent for cookies or ads', () => {
		expect(tracking.value).toBe(true)
		startLive()
		expect(Clarity.init).toHaveBeenCalledWith('zfqo2galb1')
		expect(Clarity.consentV2).toHaveBeenCalledWith({ ad_Storage: 'denied', analytics_Storage: 'denied' })
	})

	it('stops when switched off mid-visit, and doesn’t start twice when switched back on', async () => {
		startLive()
		setTracking(false)
		await nextTick()
		expect(Clarity.consent).toHaveBeenCalledWith(false)

		setTracking(true)
		await nextTick()
		expect(Clarity.init).toHaveBeenCalledOnce()
	})

	it('stays off on the next visit once switched off', () => {
		setTracking(false)
		expect(localStorage.getItem('tracking')).toBe('off')
		startLive()
		expect(Clarity.init).not.toHaveBeenCalled()
	})

	it('forgets being switched off once it’s switched back on', () => {
		setTracking(false)
		setTracking(true)
		expect(localStorage.getItem('tracking')).toBeNull()
	})
})

describe('on my own machine', () => {
	it('never starts Clarity', () => {
		withSetup(() => startTracking(false))
		expect(Clarity.init).not.toHaveBeenCalled()
	})
})
