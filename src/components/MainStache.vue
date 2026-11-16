<script setup>
// The main character: Andrew's mustache. It twirls when clicked and has
// something to say in a speech bubble.
//
// The bubble shows on hover (mouse), on tap (touch: tap again to close),
// and when focused with the keyboard.
import { ref, computed } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { canHover } from '../composables/media.js'
import { hero, family } from '../content.js'

defineProps({
	// false shows the mustache on its own, without eyes.
	eyes: { type: Boolean, default: true },
	// Where the bubble sits relative to the mustache: above | below | beside
	// ("beside" drops below on small screens, where there's no room at the side)
	bubble: { type: String, default: 'above' },
})

const hunt = useStacheHunt()
const open = ref(false)
const everOpened = ref(false)
const mood = ref('idle')
const twirl = ref(0)
let closeTimer
let moodTimer
let lastPointer = 'mouse'

const message = computed(() => (hunt.complete.value ? hero.bubbleDone : hero.bubble))
const hint = computed(() => (canHover.value ? hero.hint.hover : hero.hint.touch))

function show() {
	clearTimeout(closeTimer)
	open.value = true
	everOpened.value = true
}

function hide(delay = 0) {
	clearTimeout(closeTimer)
	closeTimer = setTimeout(() => (open.value = false), delay)
}

function onEnter(e) {
	if (e.pointerType === 'mouse') show()
}

function onLeave(e) {
	if (e.pointerType === 'mouse') hide(250)
}

// Keyboard focus shows the bubble. Focus from a click or tap doesn't count:
// hover and tap already handle those.
function onFocus(e) {
	if (e.target.matches(':focus-visible')) show()
}

function onClick() {
	mood.value = 'happy'
	twirl.value++
	clearTimeout(moodTimer)
	moodTimer = setTimeout(() => (mood.value = 'idle'), 1200)
	// Touch: a tap opens the bubble, the next tap closes it.
	if (lastPointer !== 'mouse') open.value ? hide() : show()
}
</script>

<template>
	<div
		class="main-stache"
		:class="[`bubble-${bubble}`, { open }]"
		@pointerenter="onEnter"
		@pointerleave="onLeave"
		@pointerdown="lastPointer = $event.pointerType"
		@keydown.esc="hide()"
	>
		<button
			class="face"
			type="button"
			:aria-label="`${family.me.note}. Click to make it twirl.`"
			aria-describedby="main-stache-says"
			@click="onClick"
			@focus="onFocus"
			@blur="hide(150)"
		>
			<StacheCharacter :kind="family.me.kind" :eyes="eyes" fit="face" :mood="mood" :twirl="twirl" />
		</button>
		<p class="hint" :class="{ gone: everOpened }" aria-hidden="true">{{ hint }}</p>
		<p id="main-stache-says" class="says" role="status">{{ message }}</p>
	</div>
</template>

<style scoped>
.main-stache {
	position: relative;
}

.face {
	all: unset;
	display: block;
	width: 100%;
	cursor: pointer;
	border-radius: 16px;
	-webkit-tap-highlight-color: transparent;
}

.face:focus-visible {
	outline: 2px solid var(--focus, var(--red));
	outline-offset: 8px;
}

.hint {
	position: absolute;
	left: 50%;
	top: calc(100% + 10px);
	margin: 0;
	transform: translateX(-50%);
	font-family: var(--font-mono);
	font-size: 0.72rem;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	white-space: nowrap;
	color: var(--hint, var(--ink-soft));
	transition: opacity 300ms;
	pointer-events: none;
}

.hint::before {
	content: '↑ ';
}

.hint.gone {
	opacity: 0;
}

/* The speech bubble */
.says {
	position: absolute;
	left: 50%;
	z-index: 5;
	width: max-content;
	max-width: min(300px, 78vw);
	margin: 0;
	padding: 14px 18px;
	font-size: 0.95rem;
	line-height: 1.5;
	text-align: left;
	color: var(--ink);
	background: var(--paper-raised);
	border: 1.5px solid var(--ink);
	border-radius: 18px;
	box-shadow: 0 12px 28px -14px rgb(0 0 0 / 0.45);
	opacity: 0;
	visibility: hidden;
	pointer-events: none;
	transition:
		opacity 180ms,
		transform 320ms cubic-bezier(0.34, 1.5, 0.64, 1),
		visibility 0s 180ms;
}

/* The little tail pointing at the mustache */
.says::after {
	content: '';
	position: absolute;
	left: 50%;
	width: 14px;
	height: 14px;
	background: inherit;
	border: inherit;
	border-top-color: transparent;
	border-left-color: transparent;
	border-radius: 0 0 4px 0;
}

.bubble-above .says {
	bottom: calc(100% + 18px);
	transform: translate(-50%, 8px) scale(0.96);
	transform-origin: 50% 100%;
}

.bubble-above .says::after {
	bottom: -8.5px;
	transform: translateX(-50%) rotate(45deg);
}

.bubble-below .says {
	top: calc(100% + 18px);
	transform: translate(-50%, -8px) scale(0.96);
	transform-origin: 50% 0;
}

.bubble-above.open .says,
.bubble-below.open .says {
	transform: translate(-50%, 0) scale(1);
}

.bubble-below .says::after {
	top: -8.5px;
	transform: translateX(-50%) rotate(-135deg);
}

.bubble-beside .says {
	left: calc(100% + 22px);
	top: 50%;
	transform: translate(-8px, -50%) scale(0.96);
	transform-origin: 0 50%;
}

.bubble-beside .says::after {
	left: -8.5px;
	top: 50%;
	transform: translateY(-50%) rotate(135deg);
}

.bubble-beside.open .says {
	transform: translate(0, -50%) scale(1);
}

@media (max-width: 900px) {
	.bubble-beside .says {
		left: 50%;
		top: calc(100% + 18px);
		transform: translate(-50%, -8px) scale(0.96);
		transform-origin: 50% 0;
	}

	.bubble-beside .says::after {
		left: 50%;
		top: -8.5px;
		transform: translateX(-50%) rotate(-135deg);
	}

	.bubble-beside.open .says {
		transform: translate(-50%, 0) scale(1);
	}
}

.open .says {
	opacity: 1;
	visibility: visible;
	transition:
		opacity 180ms,
		transform 320ms cubic-bezier(0.34, 1.5, 0.64, 1);
}

@media (prefers-reduced-motion: reduce) {
	.says,
	.open .says {
		transition: opacity 180ms;
	}
}
</style>
