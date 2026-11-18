import { reactive } from 'vue'

// One shared pointer for every pair of eyes on the page, so there's only ever one set of
// listeners however many mustaches are watching.
export const pointer = reactive({
	x: 0,
	y: 0,
	has: false, // false until the visitor first moves or taps
	lastMove: 0,
	// What the last press was made with: mouse | touch | pen. A click handler can check
	// this to tell a tap (no hover beforehand) from a mouse click.
	type: 'mouse',
})

function track(e) {
	pointer.x = e.clientX
	pointer.y = e.clientY
	pointer.has = true
	pointer.lastMove = performance.now()
}

window.addEventListener('pointermove', track, { passive: true })
window.addEventListener(
	'pointerdown',
	(e) => {
		track(e)
		pointer.type = e.pointerType
	},
	{ passive: true, capture: true },
)
