// Stand-ins for the browser APIs jsdom doesn't have, which my code leans on. Each one can be
// driven from a test, so I can say "the window is now narrow" or "this section scrolled
// into the middle" and watch what happens. Installed as soon as this file is imported.

// ---------- matchMedia ----------

const queries = new Map() // query → { matches, listeners }

function entry(query) {
	if (!queries.has(query)) queries.set(query, { matches: false, listeners: new Set() })
	return queries.get(query)
}

window.matchMedia = (query) => {
	const q = entry(query)
	return {
		media: query,
		get matches() {
			return q.matches
		},
		addEventListener: (type, fn) => q.listeners.add(fn),
		removeEventListener: (type, fn) => q.listeners.delete(fn),
	}
}

// Every media query starts out not matching.
export function setMedia(query, matches) {
	const q = entry(query)
	q.matches = matches
	q.listeners.forEach((fn) => fn({ matches, media: query }))
}

export function resetMedia() {
	for (const query of queries.keys()) setMedia(query, false)
}

export const MEDIA = {
	hover: '(hover: hover) and (pointer: fine)',
	narrow: '(max-width: 640px)',
	reducedMotion: '(prefers-reduced-motion: reduce)',
}

// ---------- IntersectionObserver ----------

const observers = new Set()

class FakeIntersectionObserver {
	constructor(callback, options = {}) {
		this.callback = callback
		this.options = options
		this.targets = new Set()
		observers.add(this)
	}

	observe(el) {
		this.targets.add(el)
	}

	unobserve(el) {
		this.targets.delete(el)
	}

	disconnect() {
		this.targets.clear()
		observers.delete(this)
	}

	takeRecords() {
		return []
	}
}

window.IntersectionObserver = FakeIntersectionObserver

// Tell every observer watching `el` that it moved into (or out of) view.
export function intersect(el, { isIntersecting = true, intersectionRatio = isIntersecting ? 1 : 0 } = {}) {
	for (const observer of [...observers]) {
		if (observer.targets.has(el)) observer.callback([{ target: el, isIntersecting, intersectionRatio }], observer)
	}
}

export const observing = (el) => [...observers].some((o) => o.targets.has(el))
