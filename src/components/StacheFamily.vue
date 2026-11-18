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
// Once every cousin is found, a "Hide them again" button stays under the caption.
//
// The big frame takes four squares of a 3 × 3 grid, which leaves exactly five for cousins.
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import MustacheIcon from './MustacheIcon.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { canHover } from '../composables/media.js'
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

async function hideAgain() {
	hunt.reset()
	active.value = null
	await nextTick()
	caption.value?.focus() // the button is gone, so land somewhere sensible
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => {
	document.removeEventListener('click', onDocClick)
	clearTimeout(leaveTimer)
	clearTimeout(hoverTimer)
	clearTimeout(meTimer)
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
		<ul class="frames" @pointerdown="lastPointer = $event.pointerType">
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
					<StacheCharacter :kind="family.me.kind" fit="face" :mood="meMood" :twirl="meTwirl" />
					<span class="tag">{{ family.me.name }}</span>
				</button>
			</li>

			<li
				v-for="cousin in hunt.cousins"
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
					<StacheCharacter v-if="hunt.isFound(cousin.id)" :kind="cousin.kind" fit="face" />
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
		<button v-if="hunt.complete.value" type="button" class="btn btn-ghost again" @click="hideAgain">
			{{ words.reset }}
		</button>
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
.tile :deep(.stache),
.ghost {
	position: absolute;
	left: 12%;
	top: 10%;
	width: 76%;
	height: 66%;
}

.me .tile :deep(.stache) {
	left: 15%;
	top: 13%;
	width: 70%;
	height: 70%;
}

.ghost {
	color: var(--ink);
	opacity: 0.16;
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

.again {
	margin-top: 12px;
	padding: 0.55em 1.1em;
	font-size: 0.9rem;
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
</style>
