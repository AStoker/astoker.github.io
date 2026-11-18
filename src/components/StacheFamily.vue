<script setup>
// My family portrait wall: my mustache in the big frame, and a small frame for each
// cousin. A frame is empty (just a faint outline) until that cousin has been found,
// then they move in.
//
// One caption sits under the wall and shows the clue for whichever frame you're on
// (see composables/frameSelection.js). Screen readers hear the same clue as part of
// each frame's name, so the caption isn't announced as well.
//
// Once every cousin is found, a "Hide them again" button stays under the caption, with
// my mustache tucked behind it. Hover (or focus) the button and each cousin reacts in
// its own way. Press it (or the one in the celebration toast) and they all get a
// fright, then bolt out of their frames. Each frame is a window: they vanish past its
// edge rather than running across the page. Then the hunt resets.
//
// The big frame takes four squares of a 3 × 3 grid, which leaves exactly five for cousins.
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import MustacheIcon from './MustacheIcon.vue'
import { hunt, wallCaptionInView } from '../composables/stacheHunt.js'
import { useFrameSelection } from '../composables/frameSelection.js'
import { useTimers } from '../composables/timers.js'
import { canHover, reducedMotion } from '../composables/media.js'
import { family, huntText } from '../content.js'

const wall = ref(null)
const caption = ref(null)
const selection = useFrameSelection(wall)
const { active, hover, unhover, focus, choose, wallEvents } = selection
const activeCousin = computed(() => hunt.cousin(active.value))
const prompt = computed(() => (canHover.value ? family.prompt.hover : family.prompt.touch))

// ---------- My frame ----------

const meMood = ref('idle')
const meTwirl = ref(0)
const meTimers = useTimers()

function laugh() {
	meMood.value = 'happy'
	meTwirl.value++
}

function pokeMe() {
	selection.select('me')
	meTimers.clear()
	laugh()
	meTimers.after(1200, () => (meMood.value = 'idle'))
}

// ---------- Hide them again ----------

// How each cousin takes it. `look` pins their eyes, `lean` has them edging out already,
// and `run` is the way they bolt.
const REACTIONS = {
	handlebar: { mood: 'curious', look: 'down', run: 'up' }, // all eyes on the button
	dali: { mood: 'excited', run: 'right' },
	pencil: { mood: 'nervous', look: 'left', lean: 'left', run: 'left' }, // halfway out the door
	horseshoe: { mood: 'suspicious', look: 'right', run: 'down' },
	walrus: { mood: 'sleep', run: 'right' }, // sleeps right through it
}
// A new cousin without a reaction of its own just looks on.
const reaction = (id) => REACTIONS[id] ?? { mood: 'curious', run: 'up' }

// idle → teasing (the button is hovered or focused) → startled → running → idle
const phase = ref('idle')
const scattering = computed(() => phase.value === 'startled' || phase.value === 'running')

// What a found cousin is doing in each phase.
const ACTING = {
	idle: () => ({ mood: 'idle' }),
	teasing: (r) => ({ mood: r.mood, look: r.look, lean: r.lean }),
	startled: (r) => ({ mood: 'surprised', lean: r.lean, startled: true }),
	running: (r) => ({ mood: 'surprised', look: r.run, lean: r.lean, run: r.run }),
}

const actors = computed(() =>
	Object.fromEntries(
		hunt.cousins.map((cousin) => {
			const act = ACTING[phase.value](reaction(cousin.id))
			return [
				cousin.id,
				{
					mood: act.mood,
					look: act.look ?? null,
					class: [act.lean && `lean-${act.lean}`, act.startled && 'startled', act.run && `run run-${act.run}`],
				},
			]
		}),
	),
)

// My mustache behind the button: suspicious of the whole thing, then delighted by it.
const peeker = computed(
	() =>
		({
			idle: { mood: 'suspicious', look: 'up' },
			teasing: { mood: 'suspicious', look: 'up' },
			startled: { mood: 'surprised', look: null },
			running: { mood: 'happy', look: null },
		})[phase.value],
)

function tease(on) {
	if (!scattering.value) phase.value = on ? 'teasing' : 'idle'
}

const STARTLE_MS = 650
const RUN_MS = 520
const STAGGER_MS = 80
const scatterTimers = useTimers()

function scatter() {
	if (scattering.value) return
	selection.clear()
	phase.value = 'startled'
	scatterTimers.after(STARTLE_MS, () => {
		phase.value = 'running'
		laugh() // I find this very funny
	})
	// With motion reduced they don't run; they just go once the fright is over.
	const running = reducedMotion.value ? 150 : RUN_MS + STAGGER_MS * (hunt.cousins.length - 1) + 60
	scatterTimers.after(STARTLE_MS + running, finish)
}

async function finish() {
	hunt.reset()
	phase.value = 'idle'
	selection.clear()
	meMood.value = 'idle'
	await nextTick()
	caption.value?.focus({ preventScroll: true }) // the button is gone, so land somewhere sensible
}

// Either "Hide them again" button asks through the hunt, so both get the same send-off.
watch(() => hunt.hideRequests, scatter)

// Let the celebration toast know when my caption is fully on screen, so it can step aside.
let captionObserver

onMounted(() => {
	captionObserver = new IntersectionObserver(
		([entry]) => (wallCaptionInView.value = entry.intersectionRatio > 0.99),
		{ threshold: [0, 1] },
	)
	captionObserver.observe(caption.value)
})

onBeforeUnmount(() => {
	captionObserver?.disconnect()
	wallCaptionInView.value = false
})

const status = (cousin) => (hunt.isFound(cousin.id) ? family.found : family.hiding)
const says = (cousin) => (hunt.isFound(cousin.id) ? cousin.found : cousin.clue)
// "Still hiding" needs a full stop when read aloud; "Found!" already has one.
const sentence = (text) => (/[.!?]$/.test(text) ? text : `${text}.`)
</script>

<template>
	<section id="family" ref="wall" class="family" aria-labelledby="family-title" v-on="wallEvents">
		<h2 id="family-title" class="visually-hidden">{{ family.title }}</h2>
		<ul class="frames" :class="{ scattering }" :style="{ '--run-ms': `${RUN_MS}ms` }">
			<li class="frame me" :class="{ active: active === 'me' }">
				<button
					type="button"
					class="bare-button tile"
					:aria-label="family.me.label"
					@click="pokeMe"
					@pointerenter="hover('me', $event)"
					@pointerleave="unhover"
					@focus="focus('me', $event)"
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
					class="bare-button tile"
					:aria-label="`${cousin.name}. ${sentence(status(cousin))} ${says(cousin)}`"
					@click="choose(cousin.id, $event)"
					@pointerenter="hover(cousin.id, $event)"
					@pointerleave="unhover"
					@focus="focus(cousin.id, $event)"
				>
					<span
						v-if="hunt.isFound(cousin.id)"
						class="actor"
						:class="actors[cousin.id].class"
						:style="phase === 'running' ? { animationDelay: `${i * STAGGER_MS}ms` } : null"
					>
						<StacheCharacter
							class="face"
							:kind="cousin.kind"
							fit="face"
							:mood="actors[cousin.id].mood"
							:look="actors[cousin.id].look"
						/>
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
			<template v-else-if="hunt.complete">
				{{ family.done }} {{ huntText.allBody }} <a href="#contact">{{ huntText.allLink }}</a>.
			</template>
			<template v-else>{{ family.intro }} {{ prompt }}</template>
		</p>
		<!-- Always takes its space, so the wall doesn't shift when the button comes and goes -->
		<div class="again-wrap" :class="{ out: phase !== 'idle', off: !hunt.complete }">
			<span v-if="hunt.complete" class="again-peeker" aria-hidden="true">
				<StacheCharacter :kind="family.me.kind" :mood="peeker.mood" :look="peeker.look" :rotation="10" />
			</span>
			<button
				type="button"
				class="btn btn-ghost again"
				@click="hunt.requestHide()"
				@pointerenter="tease(true)"
				@pointerleave="tease(false)"
				@focus="tease(true)"
				@blur="tease(false)"
			>
				{{ huntText.reset }}
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
	position: relative;
	display: block;
	width: 100%;
	aspect-ratio: 1;
	border: 1.5px dashed var(--rule-strong);
	border-radius: 16px;
	background: var(--paper-raised);
	transition:
		border-color 200ms,
		transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tile:hover {
	transform: translateY(-2px);
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

/* A quick step back, then gone. --run-ms is set from RUN_MS in the script. */
.run {
	animation: var(--run-ms) cubic-bezier(0.5, -0.4, 0.85, 0.4) forwards;
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
	font-variation-settings: var(--display-axes), 'opsz' 24;
}

.family {
	container-type: inline-size; /* so the caption can size itself to the wall */
}

/* Room for the longest caption, so the wall never shifts as captions change:
   three lines on a narrow wall, two once there's room */
.caption {
	min-height: 4.5em;
	margin: 16px 0 0;
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--ink-soft);
}

@container (min-width: 420px) {
	.caption {
		min-height: 3em;
	}
}

.caption:focus {
	outline: none; /* only focused by script, after hiding them again */
}

/* Hide them again, with my mustache tucked behind it. It leans out on hover. */
.again-wrap {
	position: relative;
	display: inline-block;
	margin-top: 12px;
	isolation: isolate;
	transition: opacity 250ms;
}

/* Hidden until the hunt is over, but still holding its place */
.again-wrap.off {
	visibility: hidden;
	opacity: 0;
	transition:
		opacity 250ms,
		visibility 0s 250ms;
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

.caption a {
	color: var(--ink);
	text-decoration-color: var(--red);
	text-decoration-thickness: 2px;
	text-underline-offset: 3px;
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

:root.reduce-motion .tile:hover {
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
