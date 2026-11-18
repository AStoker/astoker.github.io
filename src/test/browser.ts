// Stand-ins for the browser APIs jsdom doesn't have, which my code leans on. Each one can be
// driven from a test, so I can say "the window is now narrow" or "this section scrolled
// into the middle" and watch what happens. Installed as soon as this file is imported.

// ---------- matchMedia ----------

type MediaListener = (e: { matches: boolean; media: string }) => void

const queries = new Map<string, { matches: boolean; listeners: Set<MediaListener> }>()

function entry(query: string) {
	let q = queries.get(query)
	if (!q) queries.set(query, (q = { matches: false, listeners: new Set() }))
	return q
}

// Only the parts of MediaQueryList my code uses.
window.matchMedia = (query: string) => {
	const q = entry(query)
	return {
		media: query,
		get matches() {
			return q.matches
		},
		addEventListener: (_type: string, fn: MediaListener) => q.listeners.add(fn),
		removeEventListener: (_type: string, fn: MediaListener) => q.listeners.delete(fn),
	} as unknown as MediaQueryList
}

/** Make a media query match (or not), and tell everyone listening. They all start out false. */
export function setMedia(query: string, matches: boolean) {
	const q = entry(query)
	q.matches = matches
	q.listeners.forEach((fn) => fn({ matches, media: query }))
}

/** Put every media query back to not matching. */
export function resetMedia() {
	for (const query of queries.keys()) setMedia(query, false)
}

/** The media queries my code asks about. */
export const MEDIA = {
	hover: '(hover: hover) and (pointer: fine)',
	narrow: '(max-width: 640px)',
	reducedMotion: '(prefers-reduced-motion: reduce)',
} as const

// ---------- IntersectionObserver ----------

const observers = new Set<FakeIntersectionObserver>()

class FakeIntersectionObserver {
	readonly targets = new Set<Element>()

	constructor(
		readonly callback: IntersectionObserverCallback,
		readonly options: IntersectionObserverInit = {},
	) {
		observers.add(this)
	}

	observe(el: Element) {
		this.targets.add(el)
	}

	unobserve(el: Element) {
		this.targets.delete(el)
	}

	disconnect() {
		this.targets.clear()
		observers.delete(this)
	}

	takeRecords(): IntersectionObserverEntry[] {
		return []
	}
}

window.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver

/** Tell every observer watching `el` that it moved into (or out of) view. */
export function intersect(el: Element, { isIntersecting = true, intersectionRatio }: { isIntersecting?: boolean; intersectionRatio?: number } = {}) {
	intersectionRatio ??= isIntersecting ? 1 : 0
	for (const observer of [...observers]) {
		if (!observer.targets.has(el)) continue
		const entry = { target: el, isIntersecting, intersectionRatio } as IntersectionObserverEntry
		observer.callback([entry], observer as unknown as IntersectionObserver)
	}
}

/** Is anything watching `el`? */
export const observing = (el: Element) => [...observers].some((o) => o.targets.has(el))
