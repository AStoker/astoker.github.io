<script setup>
// A mustache that slides in from the right edge of the window when a section
// scrolls into view, has a look around, and slips away again.
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { usePointer } from '../composables/pointer.js'
import { reducedMotion } from '../composables/media.js'

const props = defineProps({
	id: { type: String, required: true },
	watch: { type: String, required: true }, // selector for the section that summons it
	size: { type: Number, default: 120 },
})

const hunt = useStacheHunt()
const pointer = usePointer()
const found = computed(() => hunt.isFound(props.id))
const label = computed(() =>
	found.value ? 'A mustache you already found. Click to make it twirl.' : 'A mustache is peeking in. Click to find it.',
)

const el = ref(null)
const peeking = ref(false)
const mood = ref('idle')
const twirl = ref(0)

const STAY = 5200 // how long it hangs around
const COOLDOWN = 12000 // before it can come back
let cooldownUntil = 0
let showTimer
let hideTimer
let observer
let startled = false

function leaveIn(ms) {
	clearTimeout(hideTimer)
	hideTimer = setTimeout(() => {
		peeking.value = false
		mood.value = 'idle'
	}, ms)
}

function arrive() {
	const now = performance.now()
	if (now < cooldownUntil) return
	cooldownUntil = now + COOLDOWN
	startled = false
	showTimer = setTimeout(() => {
		peeking.value = true
		leaveIn(STAY)
	}, 700)
}

// It notices when the cursor sneaks up on it, but sticks around long enough to be caught.
watch(
	() => [pointer.x, pointer.y],
	([x, y]) => {
		if (!peeking.value || startled || !el.value || mood.value !== 'idle') return
		const r = el.value.getBoundingClientRect()
		if (Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) < 170) {
			startled = true
			mood.value = 'surprised'
			setTimeout(() => mood.value === 'surprised' && (mood.value = 'idle'), 900)
			leaveIn(2400)
		}
	},
)

function onClick() {
	clearTimeout(hideTimer)
	if (hunt.find(props.id)) {
		mood.value = 'surprised'
		setTimeout(() => {
			mood.value = 'happy'
			twirl.value++
		}, 550)
		leaveIn(1900)
	} else {
		mood.value = 'happy'
		twirl.value++
		leaveIn(1300)
	}
}

onMounted(() => {
	const target = document.querySelector(props.watch)
	if (!target) return
	observer = new IntersectionObserver(([entry]) => entry.isIntersecting && arrive(), { threshold: 0.35 })
	observer.observe(target)
})

onBeforeUnmount(() => {
	observer?.disconnect()
	clearTimeout(showTimer)
	clearTimeout(hideTimer)
})
</script>

<template>
	<div ref="el" class="edge" :class="{ peeking, reduced: reducedMotion }" :style="{ '--w': `${size}px` }">
		<button
			class="peeker"
			type="button"
			:aria-label="label"
			:tabindex="peeking ? 0 : -1"
			:aria-hidden="peeking ? undefined : 'true'"
			@click="onClick"
		>
			<StacheCharacter :mood="mood" :rotation="-8" :twirl="twirl" />
		</button>
	</div>
</template>

<style scoped>
.edge {
	position: fixed;
	right: 0;
	top: 58vh;
	z-index: 40;
	width: var(--w);
	height: calc(var(--w) / 2);
	transform: translateX(115%);
	transition: transform 640ms cubic-bezier(0.34, 1.45, 0.64, 1);
	pointer-events: none;
}

/* Half of it shows: one eye and half a mustache round the edge of the window */
.edge.peeking {
	transform: translateX(48%);
	pointer-events: auto;
}

.peeker {
	all: unset;
	display: block;
	width: 100%;
	height: 100%;
	transform-origin: 100% 60%;
	transform: rotate(-8deg);
	cursor: pointer;
	border-radius: 12px;
	-webkit-tap-highlight-color: transparent;
}

.peeker:focus-visible {
	outline: 2px solid var(--red);
	outline-offset: 4px;
}

.reduced {
	transform: translateX(48%);
	opacity: 0;
	transition: opacity 200ms;
}

.reduced.peeking {
	opacity: 1;
}
</style>
