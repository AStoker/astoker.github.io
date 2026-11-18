import { ref, reactive, readonly, computed } from 'vue'
import { cousins } from '../content.js'

// The cousins I've hidden are listed in content.js; this keeps track of which are found.
// Components read `hunt` and change it only through its methods.
const IDS = cousins.map((c) => c.id)
const STORAGE_KEY = 'stache-hunt:v2'

function load() {
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		return Array.isArray(saved) ? saved.filter((id) => IDS.includes(id)) : []
	} catch {
		return []
	}
}

function save(ids) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
	} catch {
		// Private mode or storage blocked: the hunt still works, it just won't be remembered.
	}
}

const found = ref(load())
const lastFound = ref(null) // the cousin found most recently, until the hunt resets
const hideRequests = ref(0) // goes up each time someone asks to hide them all again

const cousin = (id) => cousins.find((c) => c.id === id)
const isFound = (id) => found.value.includes(id)

// Returns true if it's a new find, false if it was already found.
function find(id) {
	if (!IDS.includes(id) || isFound(id)) return false
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

// "Hide them again" can be pressed in two places (the portrait wall and the celebration
// toast). Both ask here; the wall answers by scattering everyone, then calls reset().
function requestHide() {
	hideRequests.value++
}

export const hunt = readonly(
	reactive({
		cousins,
		total: IDS.length,
		count: computed(() => found.value.length),
		complete: computed(() => found.value.length === IDS.length),
		lastFound,
		hideRequests,
		cousin,
		isFound,
		find,
		reset,
		requestHide,
	}),
)

// The wall's caption says the same thing as the celebration toast. The wall sets this
// while its caption is fully on screen, so the toast knows it can step aside.
export const wallCaptionInView = ref(false)
