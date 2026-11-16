<script setup>
// Hides one of the cousins behind whatever you put in the slot.
//
// How it's revealed (always the same, nothing random):
//   - A sliver of it pokes out all the time, as a hint that someone's back there.
//   - Mouse: it comes out while the pointer is over the slot, and ducks back when it leaves.
//   - Touch: tap the slot to bring it out, tap again to send it back.
//   - Keyboard: tabbing to it brings it out.
// Clicking the cousin itself counts as finding it.
//
//   <HidingStache id="handlebar" from="top" at="70%">
//     <div class="card">…</div>   ← must have an opaque background
//   </HidingStache>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { reducedMotion, narrowScreen } from '../composables/media.js'

const props = defineProps({
	id: { type: String, required: true }, // a cousin id from content.js
	from: { type: String, default: 'top' }, // top | left | right
	at: { type: String, default: '50%' }, // position along that edge
	size: { type: Number, default: 120 }, // width in px
	// How much shows while hiding and while out, as a fraction of its height (top)
	// or width (sides). Leave unset for sensible defaults.
	rest: { type: Number, default: undefined },
	out: { type: Number, default: undefined },
})

// Side peeks lean out a little, like peeking round a corner.
const LEAN = { top: 0, left: -8, right: 8 }
const DEFAULTS = {
	top: { rest: 0.19, out: 0.94 },
	left: { rest: 0.27, out: 0.52 },
	right: { rest: 0.27, out: 0.52 },
}

// Side peeks would poke off the edge of a phone screen, so they come over the top instead.
const edge = computed(() => (narrowScreen.value ? 'top' : props.from))
const amounts = computed(() => {
	const d = DEFAULTS[edge.value]
	// Custom amounts only apply to the edge they were tuned for.
	const custom = edge.value === props.from
	return { rest: (custom && props.rest) || d.rest, out: (custom && props.out) || d.out }
})

const hunt = useStacheHunt()
const cousin = hunt.cousin(props.id)
const found = computed(() => hunt.isFound(props.id))
const label = computed(() =>
	found.value
		? `${cousin.name}. You already found this one. Click to make it twirl.`
		: 'Someone is hiding here. Click to find them.',
)

const spot = ref(null)
const peeking = ref(false)
const mood = ref('idle')
const twirl = ref(0)

let hideTimer
let observer
let busyUntil = 0 // don't duck away mid-reaction
let lastPointer = 'mouse'

function show() {
	clearTimeout(hideTimer)
	peeking.value = true
}

function hide(delay = 350) {
	clearTimeout(hideTimer)
	hideTimer = setTimeout(() => {
		const wait = busyUntil - performance.now()
		if (wait > 0) return hide(wait)
		peeking.value = false
		mood.value = 'idle'
	}, delay)
}

function onEnter(e) {
	if (e.pointerType === 'mouse') show()
}

function onLeave(e) {
	if (e.pointerType === 'mouse') hide()
}

function onPointerDown(e) {
	lastPointer = e.pointerType
}

// Touch has no hover, so a tap on the slot brings the cousin out (and back).
function onCoverClick() {
	if (lastPointer === 'mouse') return
	if (peeking.value) hide(0)
	else show()
}

function onFound() {
	show()
	if (hunt.find(props.id)) {
		mood.value = 'surprised'
		busyUntil = performance.now() + 1800
		setTimeout(() => {
			mood.value = 'happy'
			twirl.value++
		}, 550)
		setTimeout(() => (mood.value = 'idle'), 1800)
	} else {
		mood.value = 'happy'
		twirl.value++
		busyUntil = performance.now() + 1100
		setTimeout(() => (mood.value = 'idle'), 1100)
	}
}

onMounted(() => {
	// Scrolled away: back into hiding, ready for next time.
	observer = new IntersectionObserver(([entry]) => {
		if (!entry.isIntersecting) hide(0)
	})
	observer.observe(spot.value)
})

onBeforeUnmount(() => {
	observer?.disconnect()
	clearTimeout(hideTimer)
})
</script>

<template>
	<div
		ref="spot"
		class="spot"
		:class="[`from-${edge}`, { peeking, reduced: reducedMotion }]"
		:style="{ '--w': `${size}px`, '--at': at, '--rest': amounts.rest, '--out': amounts.out }"
		@pointerenter="onEnter"
		@pointerleave="onLeave"
		@pointerdown="onPointerDown"
	>
		<div class="rail">
			<button
				class="peeker"
				type="button"
				:aria-label="label"
				@click="onFound"
				@focus="show"
				@blur="hide(300)"
			>
				<StacheCharacter :kind="cousin.kind" :mood="mood" :rotation="LEAN[edge]" :twirl="twirl" />
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

.reduced .rail {
	transition: none;
}

.peeker {
	all: unset;
	display: block;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	cursor: pointer;
	border-radius: 12px;
	-webkit-tap-highlight-color: transparent;
}

.peeker:focus-visible {
	outline: 2px solid var(--red);
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

.from-left .peeker {
	transform-origin: 100% 60%;
	transform: rotate(-8deg);
}

.from-right .peeker {
	transform-origin: 0 60%;
	transform: rotate(8deg);
}
</style>
