// Microsoft Clarity: heatmaps, recordings and the errors people run into on my site, so I can
// fix things before anyone has to tell me. The words about it are `tracking` in content.ts.
//
// No cookies: they're switched off in my Clarity project's settings, so each page view is its
// own anonymous visit and there's nothing to pop up a cookie question about. Everyone gets it,
// and anyone can switch it off in my footer.
import { ref, computed, watchEffect } from 'vue'
import Clarity from '@microsoft/clarity'

const CLARITY_PROJECT = 'zfqo2galb1'
const OFF_KEY = 'tracking' // 'off' once the visitor has switched it off

const switchedOff = ref(loadSwitchedOff())

function loadSwitchedOff(): boolean {
	try {
		return localStorage.getItem(OFF_KEY) === 'off'
	} catch {
		return false
	}
}

/** True while Clarity is allowed to run: always, unless the visitor switched it off. */
export const tracking = computed(() => !switchedOff.value)

/** The switch in my footer. Remembered for next time. */
export function setTracking(on: boolean) {
	switchedOff.value = !on
	try {
		if (on) localStorage.removeItem(OFF_KEY)
		else localStorage.setItem(OFF_KEY, 'off')
	} catch {
		// Storage blocked: the switch holds until the page is closed.
	}
}

// ---------- Clarity itself ----------

let started = false
let stopped = false

function apply(on: boolean) {
	if (on && !started) {
		started = true
		Clarity.init(CLARITY_PROJECT)
		// Nobody's been asked about cookies, so tell Clarity there's no consent for them (or for
		// ads, which I don't have). Sent straight after init, so it's queued and waiting before
		// Clarity's script arrives. It records without cookies, as the project is set to anyway.
		Clarity.consentV2({ ad_Storage: 'denied', analytics_Storage: 'denied' })
	} else if (!on && started && !stopped) {
		// Switched off mid-visit: Clarity stops for the rest of this page. Switching back on
		// before leaving picks up again from the next page they open.
		stopped = true
		Clarity.consent(false)
	}
}

/**
 * Start Clarity unless the visitor switched it off, and follow the switch from then on. Only
 * on the live site: `yarn dev` and `yarn preview` on my own machine don't count as visits.
 */
export function startTracking(live = import.meta.env.PROD && !['localhost', '127.0.0.1'].includes(location.hostname)) {
	if (live) watchEffect(() => apply(tracking.value))
}

/** For my tests: back to a first visit, with Clarity not started. */
export function resetTracking() {
	switchedOff.value = false
	started = false
	stopped = false
}
