import { ref, reactive, readonly, computed } from 'vue'
import { cousins } from '../content'
import type { Cousin, CousinId } from '../types'

// The cousins I've hidden are listed in content.ts; this keeps track of which are found.
// Components read `hunt` and change it only through its methods.
const IDS = cousins.map((c) => c.id)
const BY_ID = Object.fromEntries(cousins.map((c) => [c.id, c])) as Record<CousinId, Cousin>
const STORAGE_KEY = 'stache-hunt:v2'

const isCousinId = (id: unknown): id is CousinId => IDS.includes(id as CousinId)

// What's saved comes from the visitor's browser, so I check every id is still a cousin.
function load(): CousinId[] {
	try {
		const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		return Array.isArray(saved) ? saved.filter(isCousinId) : []
	} catch {
		return []
	}
}

function save(ids: CousinId[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
	} catch {
		// Private mode or storage blocked: the hunt still works, it just won't be remembered.
	}
}

const found = ref<CousinId[]>(load())
const lastFound = ref<Cousin | null>(null)
const hideRequests = ref(0)

const cousin = (id: CousinId): Cousin => BY_ID[id]
const isFound = (id: CousinId) => found.value.includes(id)

function find(id: CousinId) {
	if (isFound(id)) return false
	found.value.push(id)
	lastFound.value = cousin(id)
	save(found.value)
	return true
}

function reset() {
	found.value = []
	lastFound.value = null
	save(found.value)
}

function requestHide() {
	hideRequests.value++
}

/** The state of the hunt, read-only. Change it through its methods. */
export const hunt = readonly(
	reactive({
		/** Every cousin, in wall order. */
		cousins,
		/** How many cousins there are to find. */
		total: IDS.length,
		/** How many have been found so far. */
		count: computed(() => found.value.length),
		/** True once every cousin has been found. */
		complete: computed(() => found.value.length === IDS.length),
		/** The cousin found most recently, or null since the hunt started or was reset. */
		lastFound,
		/**
		 * Goes up each time someone asks to hide them all again. "Hide them again" can be
		 * pressed on the portrait wall or in the celebration toast; the wall watches this,
		 * scatters everyone, then calls `reset()`.
		 */
		hideRequests,
		/** Look a cousin up by id. */
		cousin,
		/** Has this cousin been found? */
		isFound,
		/**
		 * Mark a cousin as found, and remember it in the browser.
		 * @returns true if it's a new find, false if it was already found.
		 */
		find,
		/** Hide everyone again and forget them. */
		reset,
		/** Ask the portrait wall to send everyone off, then reset. */
		requestHide,
	}),
)

/**
 * True while the portrait wall's caption is fully on screen. The wall sets it; the celebration
 * toast reads it, and steps aside since the caption says the same thing.
 */
export const wallCaptionInView = ref(false)
