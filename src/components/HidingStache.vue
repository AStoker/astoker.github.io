<script setup>
// Hides a mustache behind whatever you put in the slot. It peeks out from one edge
// when the visitor hovers (or tabs to it); on touch screens it peeks on its own
// every so often while the spot is on screen. Clicking it counts as finding it.
//
//   <HidingStache id="work-slot" from="top" at="70%">
//     <div class="card">…</div>   ← must have an opaque background
//   </HidingStache>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { canHover, reducedMotion, narrowScreen } from '../composables/media.js'

const props = defineProps({
	id: { type: String, required: true }, // must be listed in SPOTS (composables/stacheHunt.js)
	from: { type: String, default: 'top' }, // top | left | right
	at: { type: String, default: '50%' }, // position along that edge
	size: { type: Number, default: 96 }, // width in px
})

// Side peeks lean out a little, like peeking round a corner.
const LEAN = { top: 0, left: -8, right: 8 }

// Side peeks would poke off the edge of a phone screen, so they come over the top instead.
const edge = computed(() => (narrowScreen.value ? 'top' : props.from))

const hunt = useStacheHunt()
const found = computed(() => hunt.isFound(props.id))
const label = computed(() =>
	found.value ? 'A mustache you already found. Click to make it twirl.' : 'Something is hiding here. Click to find it.',
)

const spot = ref(null)
const peeking = ref(false)
const mood = ref('idle')
const twirl = ref(0)

let showTimer
let hideTimer
let cycleTimer
let observer
let busyUntil = 0 // don't duck away mid-reaction

function clearTimers() {
	clearTimeout(showTimer)
	clearTimeout(hideTimer)
}

function peekSoon(delay = 160) {
	clearTimers()
	showTimer = setTimeout(() => (peeking.value = true), delay)
}

function hideSoon(delay = 450) {
	clearTimers()
	hideTimer = setTimeout(() => {
		const wait = busyUntil - performance.now()
		if (wait > 0) return hideSoon(wait)
		peeking.value = false
		mood.value = 'idle'
	}, delay)
}

const onEnter = () => canHover.value && peekSoon()
const onLeave = () => canHover.value && hideSoon()

function onClick() {
	peeking.value = true
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

// No hover on touch screens: take a peek every few seconds while on screen.
function startCycle() {
	stopCycle()
	const loop = () => {
		peeking.value = true
		hideTimer = setTimeout(() => {
			if (performance.now() >= busyUntil) peeking.value = false
		}, 2600)
		cycleTimer = setTimeout(loop, 7000)
	}
	cycleTimer = setTimeout(loop, 900)
}

function stopCycle() {
	clearTimeout(cycleTimer)
}

onMounted(() => {
	observer = new IntersectionObserver(
		([entry]) => {
			if (canHover.value) return
			if (entry.isIntersecting) {
				startCycle()
			} else {
				stopCycle()
				peeking.value = false
			}
		},
		{ threshold: 0.6 },
	)
	observer.observe(spot.value)
})

onBeforeUnmount(() => {
	observer?.disconnect()
	clearTimers()
	stopCycle()
})
</script>

<template>
	<div
		ref="spot"
		class="spot"
		:class="[`from-${edge}`, { peeking, reduced: reducedMotion }]"
		:style="{ '--w': `${size}px`, '--at': at }"
		@pointerenter="onEnter"
		@pointerleave="onLeave"
	>
		<div class="rail">
			<button
				class="peeker"
				type="button"
				:aria-label="label"
				@click="onClick"
				@focus="peekSoon(0)"
				@blur="hideSoon(300)"
			>
				<StacheCharacter :mood="mood" :rotation="LEAN[edge]" :twirl="twirl" />
			</button>
		</div>
		<div class="cover"><slot /></div>
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

/* Over the top edge: eyes up, mustache resting on the ledge */
.from-top .rail {
	top: 0;
	left: var(--at);
	transform: translate(-50%, 8px);
}

.from-top.peeking .rail {
	transform: translate(-50%, calc(var(--h) * -0.94));
}

/* Round a side edge: one eye and half the mustache, leaning out */
.from-left .rail,
.from-right .rail {
	top: var(--at);
}

.from-left .rail {
	left: 0;
	transform: translate(12px, -50%);
}

.from-left.peeking .rail {
	transform: translate(calc(var(--w) * -0.52), -50%);
}

.from-right .rail {
	right: 0;
	transform: translate(-12px, -50%);
}

.from-right.peeking .rail {
	transform: translate(calc(var(--w) * 0.52), -50%);
}

.from-left .peeker {
	transform-origin: 100% 60%;
	transform: rotate(-8deg);
}

.from-right .peeker {
	transform-origin: 0 60%;
	transform: rotate(8deg);
}

/* Reduced motion: no sliding, it just fades in where it would have peeked */
.reduced .rail {
	transition: opacity 200ms;
	opacity: 0;
}

.reduced.peeking .rail {
	opacity: 1;
}
</style>
