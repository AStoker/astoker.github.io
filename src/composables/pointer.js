import { reactive } from 'vue'

// One shared pointer for every pair of eyes on the page, so we only ever
// attach a single set of listeners no matter how many mustaches are watching.
export const pointer = reactive({
	x: 0,
	y: 0,
	has: false, // false until the visitor first moves or taps
	lastMove: 0,
})

let installed = false

export function usePointer() {
	if (!installed && typeof window !== 'undefined') {
		installed = true
		const update = (e) => {
			pointer.x = e.clientX
			pointer.y = e.clientY
			pointer.has = true
			pointer.lastMove = performance.now()
		}
		window.addEventListener('pointermove', update, { passive: true })
		window.addEventListener('pointerdown', update, { passive: true })
	}
	return pointer
}
