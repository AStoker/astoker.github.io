import { ref, onMounted, onBeforeUnmount } from 'vue'
import { pointer } from './pointer.js'
import { useTimers } from './timers.js'

// Which frame on the portrait wall the caption is about.
//
// Point at a frame (or tap it, or tab to it) and it becomes the chosen one. It stays chosen
// while you're on the wall, so you can move down and read the caption. Once you're done
// with the wall (the mouse leaves, you tap or click elsewhere, or focus moves on), nothing
// is chosen and the caption goes back to its intro. On touch, tapping the same frame
// again puts it away too.
//
// `wall` is a template ref to the element that holds the frames and the caption.
export function useFrameSelection(wall) {
	const active = ref(null)
	const hoverTimer = useTimers()
	const leaveTimer = useTimers()

	const select = (id) => (active.value = id)
	const clear = () => (active.value = null)

	// Only switch once the pointer settles on a frame, so brushing past other frames on
	// the way somewhere else doesn't change the clue being read.
	function hover(id, e) {
		if (e.pointerType !== 'mouse') return
		hoverTimer.clear()
		hoverTimer.after(110, () => select(id))
	}

	const unhover = () => hoverTimer.clear()

	// A keyboard chooses a frame by focusing it. Only a keyboard: a tap focuses the button
	// too (on Android, not iOS), and that mustn't count, or the tap's own click would
	// see the frame already chosen and put it straight away again.
	function focus(id, e) {
		if (e.target.matches(':focus-visible')) select(id)
	}

	// Touch has no hover, so a tap shows a frame's clue and a second tap puts it away.
	// (A mouse already chose the frame by hovering; a keyboard by focusing it.)
	function choose(id, e) {
		const tapped = e.detail > 0 && pointer.type !== 'mouse'
		active.value = tapped && active.value === id ? null : id
	}

	// Handlers for the wall itself
	const wallEvents = {
		pointerenter(e) {
			if (e.pointerType === 'mouse') leaveTimer.clear()
		},
		pointerleave(e) {
			if (e.pointerType !== 'mouse') return
			hoverTimer.clear()
			leaveTimer.after(600, clear)
		},
		focusout(e) {
			if (!wall.value?.contains(e.relatedTarget)) clear()
		},
	}

	// A click, not a pointerdown, so scrolling the page on a phone doesn't count.
	function onDocClick(e) {
		if (active.value && !wall.value?.contains(e.target)) clear()
	}

	onMounted(() => document.addEventListener('click', onDocClick))
	onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

	return { active, select, clear, hover, unhover, focus, choose, wallEvents }
}
