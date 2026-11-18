import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'
import { pointer } from './pointer'
import { useTimers } from './timers'

/** Which frame the caption is about, and the handlers that choose it. See {@link useFrameSelection}. */
export interface FrameSelection<Frame extends string> {
	/** The chosen frame, or null when nothing is (and the caption shows its intro). */
	active: Ref<Frame | null>
	/** Choose a frame directly. */
	select(frame: Frame): void
	/** Choose nothing: the caption goes back to its intro. */
	clear(): void
	/** A frame's `pointerenter`: chooses it once the mouse settles there. */
	hover(frame: Frame, e: PointerEvent): void
	/** A frame's `pointerleave`. */
	unhover(): void
	/** A frame's `focus`: chooses it if the keyboard moved there. */
	focus(frame: Frame, e: FocusEvent): void
	/** A frame's `click`: a tap chooses it, or puts it away if it was already chosen. */
	choose(frame: Frame, e: MouseEvent): void
	/** Handlers for the wall itself: `<section v-on="wallEvents">`. */
	wallEvents: {
		pointerenter(e: PointerEvent): void
		pointerleave(e: PointerEvent): void
		focusout(e: FocusEvent): void
	}
}

/**
 * Which frame on the portrait wall the caption is about.
 *
 * Point at a frame (or tap it, or tab to it) and it becomes the chosen one. It stays chosen
 * while you're on the wall, so you can move down and read the caption. Once you're done
 * with the wall (the mouse leaves, you tap or click elsewhere, or focus moves on), nothing
 * is chosen and the caption goes back to its intro. On touch, tapping the same frame
 * again puts it away too.
 *
 * Must be called during a component's setup.
 *
 * @param wall The element that holds the frames and the caption.
 */
export function useFrameSelection<Frame extends string>(wall: Readonly<Ref<HTMLElement | null>>): FrameSelection<Frame> {
	const active = ref<Frame | null>(null) as Ref<Frame | null>
	const hoverTimer = useTimers()
	const leaveTimer = useTimers()

	const select = (frame: Frame) => (active.value = frame)
	const clear = () => (active.value = null)
	const onWall = (target: EventTarget | null) => target instanceof Node && Boolean(wall.value?.contains(target))

	// Only switch once the pointer settles on a frame, so brushing past other frames on
	// the way somewhere else doesn't change the clue being read.
	function hover(frame: Frame, e: PointerEvent) {
		if (e.pointerType !== 'mouse') return
		hoverTimer.clear()
		hoverTimer.after(110, () => select(frame))
	}

	const unhover = () => hoverTimer.clear()

	// A keyboard chooses a frame by focusing it. Only a keyboard: a tap focuses the button
	// too (on Android, not iOS), and that mustn't count, or the tap's own click would
	// see the frame already chosen and put it straight away again.
	function focus(frame: Frame, e: FocusEvent) {
		if (e.target instanceof Element && e.target.matches(':focus-visible')) select(frame)
	}

	// Touch has no hover, so a tap shows a frame's clue and a second tap puts it away.
	// (A mouse already chose the frame by hovering; a keyboard by focusing it.)
	function choose(frame: Frame, e: MouseEvent) {
		const tapped = e.detail > 0 && pointer.type !== 'mouse'
		active.value = tapped && active.value === frame ? null : frame
	}

	const wallEvents = {
		pointerenter(e: PointerEvent) {
			if (e.pointerType === 'mouse') leaveTimer.clear()
		},
		pointerleave(e: PointerEvent) {
			if (e.pointerType !== 'mouse') return
			hoverTimer.clear()
			leaveTimer.after(600, clear)
		},
		focusout(e: FocusEvent) {
			if (!onWall(e.relatedTarget)) clear()
		},
	}

	// A click, not a pointerdown, so scrolling the page on a phone doesn't count.
	function onDocClick(e: MouseEvent) {
		if (active.value && !onWall(e.target)) clear()
	}

	onMounted(() => document.addEventListener('click', onDocClick))
	onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

	return { active, select, clear, hover, unhover, focus, choose, wallEvents }
}
