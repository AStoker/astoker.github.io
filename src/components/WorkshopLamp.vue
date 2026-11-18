<script setup>
// The workbench after hours, with a cousin sitting on the shelf in the dark.
// Only its eyes show until someone turns the lamp on.
//
// How it's revealed (always the same, nothing random):
//   - Pull the lamp cord (or click the lamp) and the shelf lights up.
//   - In the light it gets a fright, then settles. Clicking it counts as finding it.
//   - Pull the cord again and it's back in the dark.
import { ref, computed, onBeforeUnmount } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { reducedMotion } from '../composables/media.js'
import { experience } from '../content.js'

const props = defineProps({
	id: { type: String, required: true }, // a cousin id from content.js
})

const words = experience.offClock
const hunt = useStacheHunt()
const cousin = hunt.cousin(props.id)
const found = computed(() => hunt.isFound(props.id))
const label = computed(() =>
	found.value
		? `${cousin.name}. You already found this one. Click to make it twirl.`
		: 'Someone was sitting in the dark. Click to find them.',
)

const lit = ref(false)
const tugging = ref(false)
const mood = ref('idle')
const twirl = ref(0)

let timers = []
const after = (ms, fn) => timers.push(setTimeout(fn, ms))
const clearTimers = () => {
	timers.forEach(clearTimeout)
	timers = []
}

function pull() {
	clearTimers()
	lit.value = !lit.value
	if (!reducedMotion.value) {
		tugging.value = false
		requestAnimationFrame(() => (tugging.value = true))
		after(450, () => (tugging.value = false))
	}
	if (lit.value) {
		mood.value = 'surprised'
		after(900, () => (mood.value = 'idle'))
	} else {
		mood.value = 'idle'
	}
}

function onFound() {
	clearTimers()
	if (hunt.find(props.id)) {
		mood.value = 'surprised'
		after(550, () => {
			mood.value = 'happy'
			twirl.value++
		})
		after(1800, () => (mood.value = 'idle'))
	} else {
		mood.value = 'happy'
		twirl.value++
		after(1100, () => (mood.value = 'idle'))
	}
}

onBeforeUnmount(clearTimers)

// Saw teeth along the bottom of the blade, from the tip back to the handle.
const teeth = Array.from({ length: 13 }, (_, i) => {
	const x = 78 - i * 6
	return `L${x} 22 L${x - 3} 25.5`
}).join(' ')
const sawBlade = `M0 0 L78 8 ${teeth} L0 22 Z`
</script>

<template>
	<div class="workshop" :class="{ lit }">
		<svg class="scene" viewBox="0 0 360 240" aria-hidden="true" focusable="false">
			<defs>
				<pattern id="ws-peg" width="18" height="18" patternUnits="userSpaceOnUse">
					<circle class="peg" cx="9" cy="9" r="1.7" />
				</pattern>
				<radialGradient id="ws-wall" cx="180" cy="120" r="210" gradientUnits="userSpaceOnUse">
					<stop offset="0" stop-color="#6b5434" />
					<stop offset="1" stop-color="#6b5434" stop-opacity="0" />
				</radialGradient>
				<linearGradient id="ws-beam" x1="0" y1="76" x2="0" y2="204" gradientUnits="userSpaceOnUse">
					<stop offset="0" stop-color="#fff0c8" />
					<stop offset="1" stop-color="#ffd27e" stop-opacity="0.82" />
				</linearGradient>
			</defs>

			<!-- The wall, and the glow when the lamp is on -->
			<rect width="360" height="200" fill="url(#ws-peg)" />
			<rect class="glow" width="360" height="240" fill="url(#ws-wall)" />
			<path class="glow" d="M150 78 L210 78 L294 204 L66 204 Z" fill="url(#ws-beam)" />

			<!-- Woodworking: a saw hanging on the pegboard -->
			<g class="thing" transform="translate(268 30) rotate(9)">
				<path :d="sawBlade" />
				<path
					d="M2 -4 H-14 Q-27 -4 -27 9 V15 Q-27 28 -14 28 H2 Z M-6 4 H-15 Q-19 4 -19 8 V16 Q-19 20 -15 20 H-6 Z"
					fill-rule="evenodd"
				/>
			</g>

			<!-- The shelf -->
			<rect class="shelf" x="16" y="200" width="328" height="8" rx="2" />
			<path class="shelf" d="M48 208 H60 L48 226 Z M300 208 H312 L312 226 Z" />

			<!-- Pottery and gardening: a vase with something growing in it -->
			<g class="thing">
				<path class="stem" d="M78 132 C78 120 77 110 79 98" />
				<path d="M78 121 C71 114 62 115 58 121 C64 127 72 127 78 121 Z" />
				<path d="M78.5 112 C85 104 95 104 99 109 C93 116 84 117 78.5 112 Z" />
				<path d="M79 99 C75 92 77 84 83 80 C86 87 85 95 79 99 Z" />
				<path d="M64 200 C55 186 53 168 64 156 C70 149 70 143 66 137 L90 137 C86 143 86 149 92 156 C103 168 101 186 92 200 Z" />
				<rect x="62" y="131" width="32" height="7" rx="2.5" />
			</g>

			<!-- Electronics: a multimeter with its probes trailing off the shelf -->
			<g class="thing">
				<rect x="262" y="146" width="40" height="54" rx="6" />
				<path class="cable" d="M272 196 C268 212 258 216 256 232 M292 196 C298 210 308 216 306 234" />
			</g>
			<rect class="detail" x="268" y="152" width="28" height="13" rx="2" />
			<circle class="detail-line" cx="282" cy="181" r="8.5" />
			<path class="detail-line" d="M282 181 L287.5 175" />

			<!-- The lamp: click it, or pull the cord -->
			<g class="lamp" @click="pull">
				<line class="hanger" x1="180" y1="0" x2="180" y2="45" />
				<path class="shade" d="M148 78 Q150 47 180 45 Q210 47 212 78 Z" />
				<ellipse class="bulb" cx="180" cy="79" rx="13" ry="6" />
			</g>
			<g class="pull" :class="{ tugging }">
				<line x1="204" y1="72" x2="204" y2="112" />
				<circle cx="204" cy="115.5" r="4" />
				<rect x="191" y="121" width="26" height="15" rx="3.5" />
				<text x="204" y="131.6" text-anchor="middle">{{ words.lampTag }}</text>
			</g>
		</svg>

		<button class="cord" type="button" :aria-label="words.lampCord" :aria-pressed="lit" @click="pull" />

		<button
			class="dali"
			type="button"
			:aria-label="label"
			:tabindex="lit ? 0 : -1"
			:aria-hidden="lit ? undefined : 'true'"
			@click="onFound"
		>
			<StacheCharacter :kind="cousin.kind" :mood="mood" :twirl="twirl" />
		</button>
	</div>
</template>

<style scoped>
.workshop {
	--night: #1d1b18;
	--stache: #2c2925; /* in the dark, only the whites of its eyes show */
	position: relative;
	aspect-ratio: 3 / 2;
	overflow: hidden;
	border-radius: 20px;
	background: var(--night);
}

.workshop.lit {
	--stache: #1b1a17;
}

@media (prefers-color-scheme: dark) {
	.workshop {
		--night: #0c0b0a;
		box-shadow: inset 0 0 0 1px var(--rule);
	}
}

.scene {
	display: block;
	width: 100%;
	height: 100%;
}

.peg {
	fill: #2b2824;
}

.glow {
	opacity: 0;
	transition: opacity 220ms ease-out;
}

.lit .glow {
	opacity: 1;
}

.thing {
	fill: #36322c;
}

.stem,
.cable {
	fill: none;
	stroke: #36322c;
	stroke-width: 2.4;
	stroke-linecap: round;
}

.detail {
	fill: #4a443b;
}

.detail-line {
	fill: none;
	stroke: #4a443b;
	stroke-width: 2;
	stroke-linecap: round;
}

.lit .detail {
	fill: #8fa77b; /* the meter's screen, lit */
}

.shelf {
	fill: #4b4237;
}

.lit .shelf {
	fill: #7a6449;
}

.lamp {
	cursor: pointer;
}

.hanger {
	stroke: #4a443b;
	stroke-width: 2;
}

.shade {
	fill: #3f3a33;
}

.bulb {
	fill: #6a6259;
	transition: fill 200ms;
}

.lit .bulb {
	fill: #fff5d6;
}

/* The cord is pale so it reads in the dark, and dark so it reads in the light */
.pull line {
	stroke: #d9cdb8;
	stroke-width: 1.6;
}

.pull circle {
	fill: #d9cdb8;
}

.lit .pull line {
	stroke: #3a342c;
}

.lit .pull circle {
	fill: #3a342c;
}

.pull rect {
	fill: #f4efe6;
	stroke: #1b1a17;
	stroke-width: 1;
}

.pull text {
	font-family: var(--font-mono);
	font-size: 10px;
	font-weight: 600;
	fill: #1b1a17;
}

.pull {
	transition: transform 200ms;
}

.workshop:has(.cord:hover) .pull {
	transform: translateY(2px);
}

.pull.tugging {
	animation: tug 450ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes tug {
	35% {
		transform: translateY(8px);
	}
}

/* The buttons sit over the drawing. The cord's covers the bead and its tag. */
.cord,
.dali {
	all: unset;
	position: absolute;
	box-sizing: border-box;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

.cord {
	left: calc(204 / 360 * 100%);
	top: calc(106 / 240 * 100%);
	width: 44px;
	height: 50px;
	border-radius: 10px;
	transform: translateX(-50%);
}

.dali {
	left: calc(120 / 360 * 100%);
	top: calc(145 / 240 * 100%);
	width: calc(120 / 360 * 100%);
	aspect-ratio: 2 / 1;
	border-radius: 12px;
	pointer-events: none;
}

.lit .dali {
	pointer-events: auto;
}

/* Two-tone ring, so it shows on the dark wall and in the lamplight */
.cord:focus-visible,
.dali:focus-visible {
	outline: 2px solid #1b1a17;
	outline-offset: 2px;
	box-shadow: 0 0 0 6px #f4efe6;
}

:root.reduce-motion .pull,
:root.reduce-motion .workshop:has(.cord:hover) .pull {
	transition: none;
	transform: none;
}

:root.reduce-motion .pull.tugging {
	animation: none;
}
</style>
