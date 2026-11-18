import { reactive } from 'vue'

/**
 * One shared pointer for every pair of eyes on the page, so there's only ever one set of
 * listeners however many mustaches are watching.
 */
export const pointer = reactive({
	/** Where the pointer was last, in window coordinates. */
	x: 0,
	y: 0,
	/** False until the visitor first moves or taps. */
	has: false,
	/** When it last moved, from `performance.now()`. */
	lastMove: 0,
	/**
	 * What the last press was made with. A click handler can check this to tell a tap (no
	 * hover beforehand) from a mouse click.
	 */
	type: 'mouse' as string,
})

function track(e: PointerEvent) {
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
