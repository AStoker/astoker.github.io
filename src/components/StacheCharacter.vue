<script setup lang="ts">
// A mustache with a face. Pure presentation: whoever uses it decides the mood, when to
// twirl, and how it's rotated on screen. The eyes take care of themselves.
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import { MUSTACHES, type MustacheKind } from '../assets/mustaches'
import { pointer } from '../composables/pointer'
import { reducedMotion } from '../composables/media'
import { useTimers, useReplay } from '../composables/timers'
import type { Direction, Mood } from '../types'

const {
	kind = 'chevron',
	mood = 'idle',
	look = null,
	rotation = 0,
	twirl = 0,
	fit = 'standard',
} = defineProps<{
	/** Which mustache it wears. Mine by default. */
	kind?: MustacheKind
	/** How it feels, which sets its eyes, brows and any animation. */
	mood?: Mood
	/** Pin the pupils one way instead of following the pointer. */
	look?: Direction | null
	/** How it's rotated on screen, in degrees, so a sideways one still looks at the cursor. */
	rotation?: number
	/** Bump this number to make the mustache twirl. */
	twirl?: number
	/**
	 * `standard`: the same box for every kind, so hiding spots line up.
	 * `face`: the box grows to show the whole face, however long the mustache.
	 */
	fit?: 'standard' | 'face'
}>()

type Point = [x: number, y: number]

/** A pair of eyebrows: their thickness and a path for each. */
interface Brows {
	width: number
	d: [left: string, right: string]
}

// Everyone gets their own eyebrows.
const BROWS: Record<MustacheKind, Brows> = {
	chevron: { width: 2.6, d: ['M36 -19.5 Q45 -24 54 -20.5', 'M66 -20.5 Q75 -24 84 -19.5'] },
	handlebar: { width: 2.2, d: ['M36 -20 Q44 -27 54 -22', 'M66 -22 Q76 -27 84 -20'] },
	walrus: { width: 4.4, d: ['M35.5 -20.5 Q45 -23 54.5 -21', 'M65.5 -21 Q75 -23 84.5 -20.5'] },
	horseshoe: { width: 3.2, d: ['M36 -23 L54 -19.8', 'M66 -19.8 L84 -23'] },
	pencil: { width: 1.6, d: ['M37 -20.5 Q45 -25 53 -20.5', 'M67 -20.5 Q75 -25 83 -20.5'] },
	dali: { width: 1.8, d: ['M36 -22 Q45 -28 54 -23.5', 'M66 -20.5 Q75 -24 84 -20'] },
}

const shape = computed(() => MUSTACHES[kind])
const brows = computed(() => BROWS[kind])

const viewBox = computed(() => {
	if (fit !== 'face') return '4 -28 112 56'
	const [x, y, , h] = shape.value.box
	const halfWidth = Math.max(60 - x, 28) + 3
	const bottom = Math.max(y + h, 22) + 3
	return `${60 - halfWidth} -30 ${halfWidth * 2} ${bottom + 30}`
})

// ---------- Eyes ----------

const EYES = [
	{ x: 45, y: -7 },
	{ x: 75, y: -7 },
]
const MAX_LOOK = 3.9 // how far a pupil can travel from the centre of its eye
const LOOKS: Record<Direction, Point> = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }
const OPEN_EYED: readonly Mood[] = ['idle', 'surprised', 'suspicious', 'curious', 'excited', 'nervous']
const PUPIL_SIZES: Partial<Record<Mood, number>> = { surprised: 3, curious: 5.6, excited: 5 }
const eyesOpen = computed(() => OPEN_EYED.includes(mood))
const pupilSize = computed(() => PUPIL_SIZES[mood] ?? 4.4)

const root = useTemplateRef<SVGSVGElement>('root')
const pupil = reactive({ x: 0, y: 0 })

// Nobody's moving the cursor: glance around now and then.
let wander = { x: 0, y: 0, until: 0 }

function wanderLook(now: number): Point {
	if (!reducedMotion.value && now > wander.until) {
		const angle = Math.random() * Math.PI * 2
		const reach = Math.random() < 0.3 ? 0 : MAX_LOOK * (0.4 + Math.random() * 0.5)
		wander = {
			x: Math.cos(angle) * reach,
			y: Math.sin(angle) * reach,
			until: now + 1400 + Math.random() * 2200,
		}
	}
	return [wander.x, wander.y]
}

function followPointer(el: Element): Point {
	const rect = el.getBoundingClientRect()
	let dx = pointer.x - (rect.left + rect.width / 2)
	let dy = pointer.y - (rect.top + rect.height / 2)
	// Undo the on-screen rotation so the pupils move in the character's own space.
	const t = (-rotation * Math.PI) / 180
	;[dx, dy] = [dx * Math.cos(t) - dy * Math.sin(t), dx * Math.sin(t) + dy * Math.cos(t)]
	const dist = Math.hypot(dx, dy) || 1
	const reach = MAX_LOOK * (1 - Math.exp(-dist / 160))
	return [(dx / dist) * reach, (dy / dist) * reach]
}

// Where the pupils want to be: pinned, following the pointer, or wandering if it's idle.
function lookTarget(now: number, el: Element): Point {
	if (!eyesOpen.value) return [0, 0]
	if (look) return [LOOKS[look][0] * MAX_LOOK, LOOKS[look][1] * MAX_LOOK]
	const pointerIdle = !pointer.has || now - pointer.lastMove > 4000
	return pointerIdle ? wanderLook(now) : followPointer(el)
}

// The pupils ease towards their target every frame, but only while on screen.
let raf = 0
let visible = false

function frame(now: number) {
	raf = 0
	if (!visible || !root.value) return
	const [tx, ty] = lookTarget(now, root.value)
	pupil.x += (tx - pupil.x) * 0.18
	pupil.y += (ty - pupil.y) * 0.18
	raf = requestAnimationFrame(frame)
}

// ---------- Blinking and twirling ----------

const blinking = ref(false)
const blinkTimers = useTimers()

function blink(then?: () => void) {
	blinking.value = true
	blinkTimers.after(130, () => {
		blinking.value = false
		then?.()
	})
}

function scheduleBlink() {
	blinkTimers.after(2200 + Math.random() * 4200, () => {
		if (reducedMotion.value) return scheduleBlink() // hold still, but check again later
		blink(() => {
			// Every so often, a double blink.
			if (Math.random() < 0.2) blinkTimers.after(150, () => blink())
			scheduleBlink()
		})
	})
}

const { playing: twirling, play: playTwirl } = useReplay(1000)

watch(
	() => twirl,
	() => {
		if (!reducedMotion.value) playTwirl()
	},
)

let observer: IntersectionObserver | undefined

onMounted(() => {
	observer = new IntersectionObserver(([entry]) => {
		visible = Boolean(entry?.isIntersecting)
		if (visible && !raf) raf = requestAnimationFrame(frame)
	})
	if (root.value) observer.observe(root.value)
	scheduleBlink()
})

onBeforeUnmount(() => {
	observer?.disconnect()
	cancelAnimationFrame(raf)
})
</script>

<template>
	<svg
		ref="root"
		class="stache"
		:class="[`is-${mood}`, { blinking, twirling }]"
		:viewBox="viewBox"
		aria-hidden="true"
		focusable="false"
	>
		<template v-for="eye in EYES" :key="eye.x">
			<g v-if="eyesOpen" class="eye-open">
				<circle class="sclera" :cx="eye.x" :cy="eye.y" r="9.5" />
				<circle class="pupil" :cx="eye.x + pupil.x" :cy="eye.y + pupil.y" :r="pupilSize" />
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
		<path
			v-for="(d, i) in brows.d"
			:key="d"
			class="brow line"
			:class="i ? 'brow-r' : 'brow-l'"
			:d="d"
			:style="{ strokeWidth: brows.width }"
		/>

		<g class="half half-l"><path :d="shape.half" transform="translate(120 0) scale(-1 1)" /></g>
		<g class="half half-r"><path :d="shape.half" /></g>
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
	transform-box: fill-box;
	transform-origin: center;
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

/* Suspicious: eyes narrowed, one brow down and the other up */
.is-suspicious .eye-open {
	transform: scaleY(0.5);
}

.is-suspicious .brow-l {
	transform: translateY(2.5px) rotate(14deg);
}

.is-suspicious .brow-r {
	transform: translateY(-3px) rotate(-5deg);
}

/* Curious: eyes wide open with big pupils, brows up, one higher than the other */
.is-curious .eye-open {
	transform: scale(1.22);
}

.is-curious .brow-l {
	transform: translateY(-6px) rotate(-6deg);
}

.is-curious .brow-r {
	transform: translateY(-4px);
}

/* Excited: eyes wide, brows high, and jumping up and down: crouch, spring, land, squash */
.is-excited {
	transform-origin: 50% 100%;
	animation: hop 680ms infinite;
}

.is-excited .eye-open {
	transform: scale(1.1);
}

.is-excited .brow {
	transform: translateY(-5px);
}

@keyframes hop {
	0% {
		transform: translateY(0) scale(1.1, 0.88);
		animation-timing-function: ease-out;
	}
	14% {
		transform: translateY(0) scale(0.93, 1.09);
		animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); /* slowing as it rises */
	}
	46% {
		transform: translateY(-32%) scale(1, 1);
		animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); /* speeding up as it falls */
	}
	74% {
		transform: translateY(0) scale(0.95, 1.06);
		animation-timing-function: ease-out;
	}
	84% {
		transform: translateY(0) scale(1.14, 0.84);
		animation-timing-function: ease-in-out;
	}
	100% {
		transform: translateY(0) scale(1.1, 0.88);
	}
}

/* Nervous: worried brows, eyes wide */
.is-nervous .eye-open {
	transform: scale(1.06);
}

.is-nervous .brow-l {
	transform: translateY(-2px) rotate(-16deg);
}

.is-nervous .brow-r {
	transform: translateY(-2px) rotate(16deg);
}

:root.reduce-motion .is-excited {
	animation: none;
}

.twirling .half-l {
	animation: stache-twirl-l 950ms ease-in-out;
}

.twirling .half-r {
	animation: stache-twirl-r 950ms ease-in-out;
}
</style>
