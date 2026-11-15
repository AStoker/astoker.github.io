<script setup>
// The mustache character. Pure presentation: whoever uses it decides the mood,
// when to twirl, and how it's rotated on screen. The eyes take care of themselves.
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { MUSTACHE_HALF } from '../assets/mustache.js'
import { usePointer } from '../composables/pointer.js'
import { reducedMotion } from '../composables/media.js'

const props = defineProps({
	// idle | surprised | happy | sleep
	mood: { type: String, default: 'idle' },
	// How the character is rotated on screen (degrees), so a sideways one still looks at the cursor.
	rotation: { type: Number, default: 0 },
	// Bump this number to make the mustache twirl.
	twirl: { type: Number, default: 0 },
})

const EYES = [
	{ x: 45, y: -7 },
	{ x: 75, y: -7 },
]
const MAX_LOOK = 3.9 // how far a pupil can travel from the centre of its eye

const root = ref(null)
const pupil = reactive({ x: 0, y: 0 })
const blinking = ref(false)
const twirling = ref(false)
const pointer = usePointer()

let raf = 0
let visible = false
let observer
let blinkTimer
let twirlTimer
let wander = { x: 0, y: 0, until: 0 }

const eyesOpen = () => props.mood === 'idle' || props.mood === 'surprised'

function frame(now) {
	raf = 0
	if (!visible || !root.value) return

	let tx = 0
	let ty = 0
	if (eyesOpen()) {
		const idle = !pointer.has || now - pointer.lastMove > 4000
		if (idle) {
			// Nobody's moving the cursor: glance around on our own.
			if (!reducedMotion.value && now > wander.until) {
				const angle = Math.random() * Math.PI * 2
				const reach = Math.random() < 0.3 ? 0 : MAX_LOOK * (0.4 + Math.random() * 0.5)
				wander = {
					x: Math.cos(angle) * reach,
					y: Math.sin(angle) * reach,
					until: now + 1400 + Math.random() * 2200,
				}
			}
			tx = wander.x
			ty = wander.y
		} else {
			const rect = root.value.getBoundingClientRect()
			let dx = pointer.x - (rect.left + rect.width / 2)
			let dy = pointer.y - (rect.top + rect.height / 2)
			// Undo the on-screen rotation so the pupils move in the character's own space.
			const t = (-props.rotation * Math.PI) / 180
			;[dx, dy] = [dx * Math.cos(t) - dy * Math.sin(t), dx * Math.sin(t) + dy * Math.cos(t)]
			const dist = Math.hypot(dx, dy) || 1
			const reach = MAX_LOOK * (1 - Math.exp(-dist / 160))
			tx = (dx / dist) * reach
			ty = (dy / dist) * reach
		}
	}

	pupil.x += (tx - pupil.x) * 0.18
	pupil.y += (ty - pupil.y) * 0.18
	raf = requestAnimationFrame(frame)
}

function blinkOnce(then) {
	blinking.value = true
	setTimeout(() => {
		blinking.value = false
		then?.()
	}, 130)
}

function scheduleBlink() {
	blinkTimer = setTimeout(() => {
		blinkOnce(() => {
			// Every so often, a double blink.
			if (Math.random() < 0.2) setTimeout(() => blinkOnce(), 150)
			scheduleBlink()
		})
	}, 2200 + Math.random() * 4200)
}

watch(
	() => props.twirl,
	() => {
		if (reducedMotion.value) return
		twirling.value = false
		clearTimeout(twirlTimer)
		// Next frame so a twirl mid-twirl restarts the animation.
		requestAnimationFrame(() => {
			twirling.value = true
			twirlTimer = setTimeout(() => (twirling.value = false), 1000)
		})
	},
)

onMounted(() => {
	observer = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting
		if (visible && !raf) raf = requestAnimationFrame(frame)
	})
	observer.observe(root.value)
	scheduleBlink()
})

onBeforeUnmount(() => {
	observer?.disconnect()
	cancelAnimationFrame(raf)
	clearTimeout(blinkTimer)
	clearTimeout(twirlTimer)
})
</script>

<template>
	<svg
		ref="root"
		class="stache"
		:class="[`is-${mood}`, { blinking, twirling }]"
		viewBox="4 -28 112 56"
		aria-hidden="true"
		focusable="false"
	>
		<template v-for="eye in EYES" :key="eye.x">
			<g v-if="mood === 'idle' || mood === 'surprised'" class="eye-open">
				<circle class="sclera" :cx="eye.x" :cy="eye.y" r="9.5" />
				<circle
					class="pupil"
					:cx="eye.x + pupil.x"
					:cy="eye.y + pupil.y"
					:r="mood === 'surprised' ? 3 : 4.4"
				/>
				<circle class="glint" :cx="eye.x + pupil.x + 1.5" :cy="eye.y + pupil.y - 1.6" r="1.2" />
			</g>
			<!-- happy: ^ ^ -->
			<path
				v-else-if="mood === 'happy'"
				class="line"
				:d="`M${eye.x - 7} ${eye.y + 3} Q${eye.x} ${eye.y - 7} ${eye.x + 7} ${eye.y + 3}`"
			/>
			<!-- asleep: closed lids -->
			<path v-else class="line" :d="`M${eye.x - 7} ${eye.y} Q${eye.x} ${eye.y + 5} ${eye.x + 7} ${eye.y}`" />
		</template>
		<path class="brow line" d="M36 -19.5 Q45 -24 54 -20.5" />
		<path class="brow line" d="M66 -20.5 Q75 -24 84 -19.5" />

		<g class="half half-l"><path :d="MUSTACHE_HALF" transform="translate(120 0) scale(-1 1)" /></g>
		<g class="half half-r"><path :d="MUSTACHE_HALF" /></g>
	</svg>
</template>

<style scoped>
.stache {
	display: block;
	width: 100%;
	height: auto;
	overflow: visible;
}

.half path {
	fill: var(--stache);
}

.sclera {
	fill: var(--eye-white);
	stroke: var(--eye-ink);
	stroke-width: 2;
}

.pupil {
	fill: var(--eye-ink);
}

.glint {
	fill: var(--eye-white);
}

.line {
	fill: none;
	stroke: var(--stache);
	stroke-width: 2.6;
	stroke-linecap: round;
}

.eye-open {
	transform-box: fill-box;
	transform-origin: center;
	transition: transform 90ms ease-out;
}

.blinking .eye-open {
	transform: scaleY(0.1);
}

.is-surprised .eye-open {
	transform: scale(1.14);
}

.brow {
	transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.is-surprised .brow {
	transform: translateY(-4.5px);
}

.is-happy .brow {
	transform: translateY(-2px);
}

.is-sleep .brow {
	transform: translateY(2px);
}

.twirling .half-l {
	animation: stache-twirl-l 950ms ease-in-out;
}

.twirling .half-r {
	animation: stache-twirl-r 950ms ease-in-out;
}
</style>
