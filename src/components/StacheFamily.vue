<script setup>
// The family lineup: me, plus a frame for each cousin. A frame is empty (just a
// faint outline) until that cousin has been found, then they move in.
// Every frame gives its clue, so it's always clear how each one is revealed.
//
//   layout="wall"  a gallery wall for the hero: one big portrait, four small ones,
//                  and one caption underneath that changes with the frame you point at
//   layout="row"   five in a row, each with its clue written underneath
import { ref, computed } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import MustacheIcon from './MustacheIcon.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { canHover } from '../composables/media.js'
import { family } from '../content.js'

defineProps({
	layout: { type: String, default: 'row' },
})

const hunt = useStacheHunt()
const how = computed(() => (canHover.value ? 'hover' : 'touch'))

// Which frame the caption is about: the one being pointed at, else the last one clicked.
const pinned = ref(null)
const pointed = ref(null)
const active = computed(() => pointed.value ?? pinned.value)
const activeCousin = computed(() => hunt.cousins.find((c) => c.id === active.value))

const meMood = ref('idle')
const meTwirl = ref(0)
let meTimer

function pokeMe() {
	pinned.value = 'me'
	meMood.value = 'happy'
	meTwirl.value++
	clearTimeout(meTimer)
	meTimer = setTimeout(() => (meMood.value = 'idle'), 1200)
}

function point(id, e) {
	if (!e || e.pointerType === 'mouse') pointed.value = id
}

function frameLabel(cousin) {
	const status = hunt.isFound(cousin.id) ? family.found : family.hiding
	return `${cousin.name}. ${status}. ${cousin.clue[how.value]}`
}
</script>

<template>
	<div id="family" class="family" :class="`is-${layout}`">
		<ul class="frames" @pointerleave="pointed = null">
			<li class="frame me">
				<button
					type="button"
					class="tile"
					:aria-label="`${family.me.note}. Click to make it twirl.`"
					@click="pokeMe"
					@pointerenter="point('me', $event)"
					@focus="point('me')"
					@blur="pointed = null"
				>
					<StacheCharacter :kind="family.me.kind" fit="face" :mood="meMood" :twirl="meTwirl" />
					<span class="tag">{{ family.me.name }}</span>
				</button>
				<p class="under">
					<strong>{{ family.me.name }}</strong>
					<span>{{ family.me.note }}</span>
				</p>
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
					:aria-label="frameLabel(cousin)"
					:aria-pressed="layout === 'wall' ? pinned === cousin.id : undefined"
					@click="pinned = cousin.id"
					@pointerenter="point(cousin.id, $event)"
					@focus="point(cousin.id)"
					@blur="pointed = null"
				>
					<StacheCharacter v-if="hunt.isFound(cousin.id)" :kind="cousin.kind" fit="face" />
					<MustacheIcon v-else class="ghost" :kind="cousin.kind" />
					<span class="tag">{{ cousin.name }}</span>
				</button>
				<p class="under">
					<strong>{{ cousin.name }}</strong>
					<span class="status" :class="{ on: hunt.isFound(cousin.id) }">
						{{ hunt.isFound(cousin.id) ? family.found : family.hiding }}
					</span>
					<span>{{ cousin.clue[how] }}</span>
					<a :href="`#${cousin.section}`">{{ family.go }} <span aria-hidden="true">↓</span></a>
				</p>
			</li>

			<li class="frame tally" aria-hidden="true">
				<div class="tile">
					<span class="big">{{ hunt.count.value }}/{{ hunt.total }}</span>
					<span class="tag">found</span>
				</div>
			</li>
		</ul>

		<!-- Wall only: one caption that follows the frame you point at -->
		<p class="caption" aria-live="polite">
			<template v-if="activeCousin">
				<strong>{{ activeCousin.name }}</strong>
				<span class="status" :class="{ on: hunt.isFound(activeCousin.id) }">
					{{ hunt.isFound(activeCousin.id) ? family.found : family.hiding }}
				</span>
				{{ activeCousin.clue[how] }}
				<a :href="`#${activeCousin.section}`">{{ family.go }} <span aria-hidden="true">↓</span></a>
			</template>
			<template v-else-if="active === 'me'">{{ family.meHello }}</template>
			<template v-else>{{ family.wallIntro }} {{ family.prompt[how] }}</template>
		</p>
	</div>
</template>

<style scoped>
.frames {
	display: grid;
	gap: 12px;
	margin: 0;
	padding: 0;
	list-style: none;
}

.tile {
	all: unset;
	position: relative;
	display: grid;
	place-items: center;
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
	outline: 2px solid var(--red);
	outline-offset: 3px;
}

.frame.found .tile,
.frame.active .tile {
	border-style: solid;
	border-color: var(--ink);
}

.me .tile {
	border: 0;
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

.me .tag {
	color: var(--on-red);
}

.status {
	display: inline-block;
	padding: 1px 7px;
	font-family: var(--font-mono);
	font-size: 0.68rem;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	border: 1px solid currentColor;
	border-radius: 999px;
	color: var(--ink-soft);
}

.status.on {
	color: var(--red-text);
}

a {
	white-space: nowrap;
	text-decoration-color: var(--red);
	text-decoration-thickness: 2px;
	text-underline-offset: 3px;
}

/* ---------- Row: five across, clue under each ---------- */

.is-row .frames {
	grid-template-columns: repeat(5, minmax(0, 1fr));
	gap: clamp(12px, 2vw, 24px);
}

.is-row .tally,
.is-row .caption,
.is-row .tag {
	display: none;
}

.under {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
	margin: 14px 0 0;
	font-size: 0.92rem;
	line-height: 1.45;
	color: var(--ink-soft);
}

.under strong {
	font-family: var(--font-display);
	font-size: 1.15rem;
	font-weight: 600;
	color: var(--ink);
	font-variation-settings: 'SOFT' 100, 'WONK' 1;
}

@media (max-width: 900px) {
	.is-row .frames {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

/* ---------- Wall: big portrait, four small frames, one caption ---------- */

.is-wall .frames {
	grid-template-columns: repeat(3, minmax(0, 1fr));
}

.is-wall .me {
	grid-column: 1 / span 2;
	grid-row: 1 / span 2;
}

.is-wall .me .tile {
	border-radius: 24px;
}

.is-wall .me .tile :deep(.stache) {
	left: 15%;
	top: 13%;
	width: 70%;
	height: 70%;
}

.is-wall .me .tag {
	left: 7%;
	bottom: 6%;
	text-align: left;
	font-size: 0.75rem;
}

.is-wall .under {
	display: none;
}

.tally .tile {
	border-style: solid;
	border-color: var(--rule);
	background: transparent;
}

.big {
	font-family: var(--font-display);
	font-size: clamp(1.6rem, 3.4vw, 2.5rem);
	font-weight: 500;
	letter-spacing: -0.02em;
	font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 144;
}

.caption {
	min-height: 4.6em;
	margin: 16px 0 0;
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--ink-soft);
}

.caption strong {
	margin-right: 6px;
	color: var(--ink);
}

.caption .status {
	margin-right: 4px;
}

@media (prefers-reduced-motion: reduce) {
	.tile {
		transition: none;
	}

	button.tile:hover {
		transform: none;
	}
}
</style>
