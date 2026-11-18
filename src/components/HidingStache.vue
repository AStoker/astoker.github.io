<script setup lang="ts">
// Hides one of my cousins behind whatever goes in the slot.
//
// How it's revealed (always the same, nothing random):
//   - A sliver of it pokes out all the time, as a hint that someone's back there.
//   - Mouse: it comes out while the pointer is over the slot, and ducks back when it leaves.
//   - Touch: tap the slot to bring it out, tap again to send it back.
//   - Keyboard: tabbing to it brings it out. Escape sends a hover-peek back.
// Clicking the cousin itself counts as finding it.
//
//   <HidingStache id="handlebar" from="top" at="70%">
//     <div class="card">…</div>   ← must have an opaque background
//   </HidingStache>
import { ref, computed, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { useCousin } from '../composables/cousin'
import { useTimers } from '../composables/timers'
import { pointer } from '../composables/pointer'
import { narrowScreen } from '../composables/media'
import type { CousinId } from '../types'

/** The edge of the slot the cousin hides behind. */
type Edge = 'top' | 'left' | 'right'

const {
	id,
	from = 'top',
	at = '50%',
	size = 120,
} = defineProps<{
	/** Which cousin hides here. */
	id: CousinId
	/** The edge it peeks over. On a phone, side peeks come over the top instead. */
	from?: Edge
	/** Where along that edge, as a CSS length: `70%`. */
	at?: string
	/** How wide it is, in pixels. */
	size?: number
}>()

// How much of it shows while hiding and while out, as a fraction of its height (top) or
// width (sides). Side peeks lean out a little (degrees), like peeking round a corner.
const PEEK: Record<Edge, { rest: number; out: number; lean: number }> = {
	top: { rest: 0.19, out: 0.94, lean: 0 },
	left: { rest: 0.27, out: 0.52, lean: -8 },
	right: { rest: 0.27, out: 0.52, lean: 8 },
}

// Side peeks would poke off the edge of a phone screen, so they come over the top instead.
const edge = computed<Edge>(() => (narrowScreen.value ? 'top' : from))
const peek = computed(() => PEEK[edge.value])

const { cousin, label, mood, twirl, reacting, onFound } = useCousin(id)

const spot = useTemplateRef<HTMLElement>('spot')
const button = useTemplateRef<HTMLButtonElement>('button')

// Out while it's wanted (hovered, focused or tapped), and always while it's still reacting
// to being found, so it never ducks away mid-celebration.
const wanted = ref(false)
const peeking = computed(() => wanted.value || reacting.value)
const hideTimer = useTimers()

function show() {
	hideTimer.clear()
	wanted.value = true
}

function hide(delay = 350) {
	hideTimer.clear()
	hideTimer.after(delay, () => (wanted.value = false))
}

function onEnter(e: PointerEvent) {
	if (e.pointerType === 'mouse') show()
}

function onLeave(e: PointerEvent) {
	if (e.pointerType === 'mouse') hide()
}

// Touch has no hover, so a tap on the slot brings the cousin out (and back).
function onCoverClick() {
	if (pointer.type === 'mouse') return
	if (peeking.value) hide(0)
	else show()
}

function onClick() {
	show()
	onFound()
}

// Content that pops out on hover has to be dismissible without moving the pointer.
// (When it's out because it has keyboard focus, it stays: it's the thing focused.)
function onKey(e: KeyboardEvent) {
	if (e.key === 'Escape' && peeking.value && document.activeElement !== button.value) hide(0)
}

let observer: IntersectionObserver | undefined

onMounted(() => {
	document.addEventListener('keydown', onKey)
	// Scrolled away: back into hiding, ready for next time.
	observer = new IntersectionObserver(([entry]) => {
		if (!entry?.isIntersecting) hide(0)
	})
	if (spot.value) observer.observe(spot.value)
})

onBeforeUnmount(() => {
	document.removeEventListener('keydown', onKey)
	observer?.disconnect()
})
</script>

<template>
	<div
		ref="spot"
		class="spot"
		:class="[`from-${edge}`, { peeking }]"
		:style="{ '--w': `${size}px`, '--at': at, '--rest': peek.rest, '--out': peek.out, '--lean': `${peek.lean}deg` }"
		@pointerenter="onEnter"
		@pointerleave="onLeave"
	>
		<div class="rail">
			<button
				ref="button"
				class="bare-button peeker"
				type="button"
				:aria-label="label"
				@click="onClick"
				@focus="show"
				@blur="hide(300)"
			>
				<StacheCharacter :kind="cousin.kind" :mood="mood" :rotation="peek.lean" :twirl="twirl" />
			</button>
		</div>
		<div class="cover" @click="onCoverClick"><slot /></div>
	</div>
</template>

<style scoped>
.spot {
	--h: calc(var(--w) / 2);
	position: relative;
	isolation: isolate;
}

.cover {
	position: relative;
	z-index: 1;
	height: 100%;
}

.rail {
	position: absolute;
	z-index: 0;
	width: var(--w);
	height: var(--h);
	transition: transform 520ms cubic-bezier(0.34, 1.45, 0.64, 1);
}

.peeker {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 12px;
}

.peeker:focus-visible {
	outline-offset: 4px;
}

/* Over the top edge: eyebrows showing while hiding, then eyes up and mustache on the ledge */
.from-top .rail {
	top: 0;
	left: var(--at);
	transform: translate(-50%, calc(var(--h) * var(--rest) * -1));
}

.from-top.peeking .rail {
	transform: translate(-50%, calc(var(--h) * var(--out) * -1));
}

/* Round a side edge: a whisker showing while hiding, then one eye and half the mustache */
.from-left .rail,
.from-right .rail {
	top: var(--at);
}

.from-left .rail {
	left: 0;
	transform: translate(calc(var(--w) * var(--rest) * -1), -50%);
}

.from-left.peeking .rail {
	transform: translate(calc(var(--w) * var(--out) * -1), -50%);
}

.from-right .rail {
	right: 0;
	transform: translate(calc(var(--w) * var(--rest)), -50%);
}

.from-right.peeking .rail {
	transform: translate(calc(var(--w) * var(--out)), -50%);
}

/* Leaning round the corner (--lean comes from PEEK, so the eyes know about it too) */
.from-left .peeker,
.from-right .peeker {
	transform: rotate(var(--lean));
}

.from-left .peeker {
	transform-origin: 100% 60%;
}

.from-right .peeker {
	transform-origin: 0 60%;
}

:root.reduce-motion .rail {
	transition: none;
}
</style>
