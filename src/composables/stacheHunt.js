import { reactive, computed } from 'vue'

// Every hidden mustache on the page. Add an id here when you add a new hiding spot.
export const SPOTS = ['work-slot', 'edge-peek', 'contact-card', 'footer-nap']

const STORAGE_KEY = 'stache-hunt:v1'

function load() {
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		return Array.isArray(saved) ? saved.filter((id) => SPOTS.includes(id)) : []
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
})

const count = computed(() => state.found.length)
const complete = computed(() => state.found.length === SPOTS.length)

function isFound(id) {
	return state.found.includes(id)
}

function find(id) {
	if (!SPOTS.includes(id) || isFound(id)) return false
	state.found.push(id)
	state.lastFound = id
	state.findCount++
	save(state.found)
	if (complete.value) state.celebrating = true
	return true
}

function reset() {
	state.found.splice(0)
	state.celebrating = false
	state.lastFound = null
	save(state.found)
}

export function useStacheHunt() {
	return { state, total: SPOTS.length, count, complete, isFound, find, reset }
}
