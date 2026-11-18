<script setup>
// The family portrait wall: Andrew's mustache in the big frame, and a small frame
// for each cousin. A frame is empty (just a faint outline) until that cousin has
// been found, then they move in.
//
// One caption sits under the wall. Point at a frame (or tap it, or tab to it) and
// the caption switches to that frame's clue, and stays there while you're on the wall,
// so you can move down and read it. Once you're done with the wall (the mouse leaves,
// you tap or click elsewhere, or focus moves on) it goes back to the intro. On touch,
// tapping the same frame again does that too. Screen readers hear the same clue as part
// of each frame's name, so the caption isn't announced as well.
//
// Once every cousin is found, a "Hide them again" button stays under the caption, with
// Andrew's mustache tucked behind it. Hover (or focus) the button and each cousin reacts
// in its own way. Press it (or the one in the celebration toast) and they all get a
// fright, then bolt out of their frames. Each frame is a window: they vanish past its
// edge rather than running across the page. Then the hunt resets.
//
// The big frame takes four squares of a 3 × 3 grid, which leaves exactly five for cousins.
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import MustacheIcon from './MustacheIcon.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { canHover, reducedMotion } from '../composables/media.js'
import { family, hunt as words } from '../content.js'

const hunt = useStacheHunt()
const prompt = computed(() => (canHover.value ? family.prompt.hover : family.prompt.touch))

// The frame the caption is about. It only changes when another frame is chosen.
const active = ref(null)
const activeCousin = computed(() => hunt.cousins.find((c) => c.id === active.value))

const meMood = ref('idle')
const meTwirl = ref(0)
let meTimer

function pokeMe() {
	active.value = 'me'
	meMood.value = 'happy'
	meTwirl.value++
	clearTimeout(meTimer)
	meTimer = setTimeout(() => (meMood.value = 'idle'), 1200)
}

// Only switch when the pointer settles on a frame, so that brushing past other
// frames on the way somewhere else doesn't change the clue being read.
let hoverTimer

function hover(id, e) {
	if (e.pointerType !== 'mouse') return
	clearTimeout(hoverTimer)
	hoverTimer = setTimeout(() => (active.value = id), 110)
}

function unhover() {
	clearTimeout(hoverTimer)
}

// Back to the intro when you're done with the wall.
const wall = ref(null)
const caption = ref(null)
let leaveTimer

function onWallEnter(e) {
	if (e.pointerType === 'mouse') clearTimeout(leaveTimer)
}

function onWallLeave(e) {
	if (e.pointerType !== 'mouse') return
	clearTimeout(hoverTimer)
	leaveTimer = setTimeout(() => (active.value = null), 600)
}

function onWallFocusOut(e) {
	if (!wall.value?.contains(e.relatedTarget)) active.value = null
}

// A click, not a pointerdown, so scrolling the page on a phone doesn't count.
function onDocClick(e) {
	if (active.value && !wall.value?.contains(e.target)) active.value = null
}

// Touch has no hover, so a tap shows a frame's clue and a second tap puts it away.
// (A mouse already chose the frame by hovering; a keyboard by focusing it.)
let lastPointer = 'mouse'

function choose(id, e) {
	const tapped = e.detail > 0 && lastPointer !== 'mouse'
	active.value = tapped && active.value === id ? null : id
}

// ---------- Hide them again ----------

// How each cousin takes it, in wall order (repeats if more cousins are added).
// `look` pins the eyes, `lean` has them edging out already, `run` is the way they bolt.
const REACTIONS = [
	{ mood: 'suspicious', look: 'left', run: 'up' }, // the Handlebar
	{ mood: 'excited', run: 'right' }, // the Dalí
	{ mood: 'nervous', look: 'left', lean: 'left', run: 'left' }, // the Pencil, halfway out the door
	{ mood: 'suspicious', look: 'right', run: 'down' }, // the Horseshoe
	{ mood: 'sleep', run: 'right' }, // the Walrus sleeps right through it
]
const reaction = (i) => REACTIONS[i % REACTIONS.length]
const STARTLE_MS = 650
const RUN_MS = 520 // keep in step with .run in the styles below
const STAGGER_MS = 80

const teasing = ref(false) // the button is hovered or focused
const phase = ref('idle') // idle | startled | running
let scatterTimers = []

function cousinMood(i) {
	if (phase.value !== 'idle') return 'surprised'
	return teasing.value ? reaction(i).mood : 'idle'
}

function cousinLook(i) {
	if (phase.value === 'running') return reaction(i).run
	if (phase.value === 'idle' && teasing.value) return reaction(i).look ?? null
	return null
}

function actorClass(i) {
	const { lean, run } = reaction(i)
	return {
		[`lean-${lean}`]: lean && (teasing.value || phase.value !== 'idle'),
		startled: phase.value === 'startled',
		[`run run-${run}`]: phase.value === 'running',
	}
}

const peekerMood = computed(() => ({ idle: 'suspicious', startled: 'surprised', running: 'happy' })[phase.value])

function scatter() {
	if (phase.value !== 'idle') return
	if (!hunt.count.value) return finish()
	active.value = null
	phase.value = 'startled'
	scatterTimers.push(
		setTimeout(() => {
			phase.value = 'running'
			meMood.value = 'happy' // Andrew finds this very funny
			meTwirl.value++
		}, STARTLE_MS),
	)
	// With motion reduced they don't run; they just go once the fright is over.
	const running = reducedMotion.value ? 150 : RUN_MS + STAGGER_MS * (hunt.cousins.length - 1) + 60
	scatterTimers.push(setTimeout(finish, STARTLE_MS + running))
}

async function finish() {
	hunt.reset()
	phase.value = 'idle'
	teasing.value = false
	active.value = null
	meMood.value = 'idle'
	await nextTick()
	caption.value?.focus({ preventScroll: true }) // the button is gone, so land somewhere sensible
}

// Either "Hide them again" button asks through the hunt, so both get the same send-off.
watch(() => hunt.state.hideRequests, scatter)

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => {
	document.removeEventListener('click', onDocClick)
	clearTimeout(leaveTimer)
	clearTimeout(hoverTimer)
	clearTimeout(meTimer)
	scatterTimers.forEach(clearTimeout)
})

const status = (cousin) => (hunt.isFound(cousin.id) ? family.found : family.hiding)
const says = (cousin) => (hunt.isFound(cousin.id) ? cousin.found : cousin.clue)
// "Still hiding" needs a full stop when read aloud; "Found!" already has one.
const sentence = (text) => (/[.!?]$/.test(text) ? text : `${text}.`)
</script>

<template>
	<section
		id="family"
		ref="wall"
		class="family"
		aria-labelledby="family-title"
		@pointerenter="onWallEnter"
		@pointerleave="onWallLeave"
		@focusout="onWallFocusOut"
	>
		<h2 id="family-title" class="visually-hidden">{{ family.title }}</h2>
		<ul class="frames" :class="{ scattering: phase !== 'idle' }" @pointerdown="lastPointer = $event.pointerType">
			<li class="frame me" :class="{ active: active === 'me' }">
				<button
					type="button"
					class="tile"
					:aria-label="`${family.me.name}: ${family.me.note}. Click to make it twirl.`"
					@click="pokeMe"
					@pointerenter="hover('me', $event)"
					@pointerleave="unhover"
					@focus="active = 'me'"
				>
					<StacheCharacter class="me-face" :kind="family.me.kind" fit="face" :mood="meMood" :twirl="meTwirl" />
					<span class="tag">{{ family.me.name }}</span>
				</button>
			</li>

			<li
				v-for="(cousin, i) in hunt.cousins"
				:key="cousin.id"
				class="frame"
				:class="{ found: hunt.isFound(cousin.id), active: active === cousin.id }"
			>
				<button
					type="button"
					class="tile"
					:aria-label="`${cousin.name}. ${sentence(status(cousin))} ${says(cousin)}`"
					@click="choose(cousin.id, $event)"
					@pointerenter="hover(cousin.id, $event)"
					@pointerleave="unhover"
					@focus="active = cousin.id"
				>
					<span
						v-if="hunt.isFound(cousin.id)"
						class="actor"
						:class="actorClass(i)"
						:style="phase === 'running' ? { animationDelay: `${i * STAGGER_MS}ms` } : null"
					>
						<StacheCharacter class="face" :kind="cousin.kind" fit="face" :mood="cousinMood(i)" :look="cousinLook(i)" />
					</span>
					<MustacheIcon v-else class="ghost" :kind="cousin.kind" />
					<span class="tag">{{ cousin.name }}</span>
				</button>
			</li>
		</ul>

		<p ref="caption" class="caption" tabindex="-1">
			<template v-if="activeCousin">
				<strong>{{ activeCousin.name }}</strong>
				<span class="status" :class="{ on: hunt.isFound(activeCousin.id) }">{{ status(activeCousin) }}</span>
				{{ says(activeCousin) }}
			</template>
			<template v-else-if="active === 'me'">{{ family.meHello }}</template>
			<template v-else-if="hunt.complete.value">{{ family.done }}</template>
			<template v-else>{{ family.intro }} {{ prompt }}</template>
		</p>
		<div v-if="hunt.complete.value" class="again-wrap" :class="{ out: teasing || phase !== 'idle' }">
			<span class="again-peeker" aria-hidden="true">
				<StacheCharacter :kind="family.me.kind" :mood="peekerMood" :look="phase === 'idle' ? 'up' : null" :rotation="10" />
			</span>
			<button
				type="button"
				class="btn btn-ghost again"
				@click="hunt.requestHide()"
				@pointerenter="teasing = true"
				@pointerleave="teasing = false"
				@focus="teasing = true"
				@blur="teasing = false"
			>
				{{ words.reset }}
			</button>
		</div>
	</section>
</template>

<style scoped>
.frames {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px;
	margin: 0;
	padding: 0;
	list-style: none;
}

.me {
	grid-column: 1 / span 2;
	grid-row: 1 / span 2;
}

.tile {
	all: unset;
	position: relative;
	display: block;
	box-sizing: border-box;
	width: 100%;
	aspect-ratio: 1;
	border: 1.5px dashed var(--rule-strong);
	border-radius: 16px;
	background: var(--paper-raised);
	transition:
		border-color 200ms,
		transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

button.tile {
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

button.tile:hover {
	transform: translateY(-2px);
}

button.tile:focus-visible {
	outline: 2px solid var(--focus);
	outline-offset: 3px;
}

.frame.found .tile,
.frame.active .tile {
	border-style: solid;
	border-color: var(--ink);
}

.me .tile {
	border: 0;
	border-radius: 24px;
	background: var(--red);
	--stache: var(--on-red);
}

.me .tile:focus-visible {
	outline-color: var(--ink);
}

/* Every portrait fits the same area of its frame, however long the mustache */
.actor,
.ghost {
	position: absolute;
	left: 12%;
	top: 10%;
	width: 76%;
	height: 66%;
}

.actor > .face {
	width: 100%;
	height: 100%;
}

.tile > .me-face {
	position: absolute;
	left: 15%;
	top: 13%;
	width: 70%;
	height: 70%;
}

.ghost {
	color: var(--ink);
	opacity: 0.16;
	animation: ghost-in 400ms ease-out; /* fades back in once they've run off */
}

@keyframes ghost-in {
	from {
		opacity: 0;
	}
}

/* ---------- Hide them again: the reactions and the scatter ---------- */

.actor {
	transition:
		translate 320ms cubic-bezier(0.34, 1.45, 0.64, 1),
		rotate 320ms cubic-bezier(0.34, 1.45, 0.64, 1);
}

/* Already edging towards the side of the frame, shaking */
.lean-left {
	translate: -16% 0;
	rotate: -8deg;
}

.lean-right {
	translate: 16% 0;
	rotate: 8deg;
}

.lean-left > .face,
.lean-right > .face {
	animation: shiver 90ms linear infinite alternate;
}

@keyframes shiver {
	to {
		transform: translateX(2%);
	}
}

/* Each frame is a window: they disappear past its edge */
.scattering .tile {
	overflow: hidden;
}

.startled {
	animation: startle 360ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes startle {
	40% {
		transform: translateY(-12%) scale(1.06);
	}
}

/* A quick step back, then gone. Keep the duration in step with RUN_MS. */
.run {
	animation: 520ms cubic-bezier(0.5, -0.4, 0.85, 0.4) forwards;
}

.run-up {
	animation-name: run-up;
}

.run-down {
	animation-name: run-down;
}

.run-left {
	animation-name: run-left;
}

.run-right {
	animation-name: run-right;
}

@keyframes run-up {
	to {
		transform: translateY(-175%);
	}
}

@keyframes run-down {
	to {
		transform: translateY(175%);
	}
}

@keyframes run-left {
	to {
		transform: translateX(-150%);
	}
}

@keyframes run-right {
	to {
		transform: translateX(150%);
	}
}

.tag {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 7%;
	font-family: var(--font-mono);
	font-size: 0.66rem;
	letter-spacing: 0.05em;
	text-transform: uppercase;
	text-align: center;
	color: var(--ink-soft);
}

/* Big and bold, so the dark-on-red label reads (large text needs 3:1; this is 3.6:1) */
.me .tag {
	left: 7%;
	bottom: 5%;
	font-family: var(--font-display);
	font-size: 1.25rem;
	font-weight: 700;
	letter-spacing: 0;
	text-transform: none;
	text-align: left;
	color: var(--on-red);
	font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 24;
}


.caption {
	min-height: 3.2em;
	margin: 16px 0 0;
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--ink-soft);
}

.caption:focus {
	outline: none; /* only focused by script, after hiding them again */
}

/* Hide them again, with Andrew's mustache tucked behind it. It leans out on hover. */
.again-wrap {
	position: relative;
	display: inline-block;
	margin-top: 12px;
	isolation: isolate;
}

.again {
	position: relative;
	z-index: 1;
	padding: 0.55em 1.1em;
	font-size: 0.9rem;
	background: var(--paper); /* solid, so the mustache behind stays hidden */
}

.again-peeker {
	position: absolute;
	z-index: 0;
	top: 50%;
	right: 12px;
	width: 58px;
	pointer-events: none;
	transform: translate(0, -50%);
	transition: transform 380ms cubic-bezier(0.34, 1.45, 0.64, 1);
}

.again-wrap.out .again-peeker {
	transform: translate(42px, -50%) rotate(10deg);
}

.caption strong {
	margin-right: 6px;
	color: var(--ink);
}

.status {
	display: inline-block;
	margin-right: 4px;
	padding: 1px 7px;
	font-family: var(--font-mono);
	font-size: 0.68rem;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	border: 1px solid currentColor;
	border-radius: 999px;
}

.status.on {
	color: var(--red-text);
}

:root.reduce-motion .tile {
	transition: none;
}

:root.reduce-motion button.tile:hover {
	transform: none;
}

:root.reduce-motion .actor,
:root.reduce-motion .again-peeker {
	transition: none;
}

:root.reduce-motion .lean-left > .face,
:root.reduce-motion .lean-right > .face,
:root.reduce-motion .startled {
	animation: none;
}

/* No running: they simply go */
:root.reduce-motion .run {
	animation: none;
	visibility: hidden;
}
</style>
