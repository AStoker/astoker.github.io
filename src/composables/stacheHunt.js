import { reactive, computed } from 'vue'
import { cousins } from '../content.js'

// The hidden cousins are listed in content.js; this keeps track of which are found.
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

function save(found) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
	} catch {
		// Private mode or storage blocked: the hunt still works, it just won't be remembered.
	}
}

const state = reactive({
	found: load(),
	celebrating: false, // true right after the last one is found
	lastFound: null,
	findCount: 0, // bumps on every new find, handy for triggering animations
	hideRequests: 0, // bumps when someone asks to hide them again; the portrait wall scatters them, then resets
})

const count = computed(() => state.found.length)
const complete = computed(() => state.found.length === IDS.length)

const cousin = (id) => cousins.find((c) => c.id === id)

function isFound(id) {
	return state.found.includes(id)
}

function find(id) {
	if (!IDS.includes(id) || isFound(id)) return false
	state.found.push(id)
	state.lastFound = id
	state.findCount++
	save(state.found)
	if (complete.value) state.celebrating = true
	return true
}

// "Hide them again" from anywhere: the portrait wall plays the scatter, then calls reset().
function requestHide() {
	state.hideRequests++
}

function reset() {
	state.found.splice(0)
	state.celebrating = false
	state.lastFound = null
	save(state.found)
}

export function useStacheHunt() {
	return { state, cousins, cousin, total: IDS.length, count, complete, isFound, find, reset, requestHide }
}
