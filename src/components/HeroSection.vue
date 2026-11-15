<script setup>
import { ref, onMounted } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { profile, hero } from '../content.js'

const mood = ref('idle')
const twirl = ref(0)
const bubble = ref(false)
let resetTimer

function poke() {
	mood.value = 'happy'
	twirl.value++
	clearTimeout(resetTimer)
	resetTimer = setTimeout(() => (mood.value = 'idle'), 1200)
}

onMounted(() => setTimeout(() => (bubble.value = true), 1800))
</script>

<template>
	<section id="top" class="hero container">
		<div class="hero-copy">
			<p class="kicker">{{ profile.role }} <span aria-hidden="true">—</span> {{ profile.location }}</p>
			<h1 class="hero-name">
				<span>{{ profile.firstName }}</span>
				<span>{{ profile.lastName }}</span>
			</h1>
			<p class="lede">
				{{ hero.lede }} <span class="aside">{{ hero.aside }}</span>.
			</p>
			<div class="actions">
				<a class="btn btn-solid" href="#work">Work in progress</a>
				<a class="btn btn-ghost" href="#contact">Say hi</a>
			</div>
		</div>

		<div class="hero-art">
			<div class="sun" aria-hidden="true"></div>
			<button class="hero-stache" type="button" aria-label="Twirl the mustache" @click="poke">
				<StacheCharacter :mood="mood" :twirl="twirl" />
			</button>
			<p class="bubble" :class="{ show: bubble }">{{ hero.bubble }}</p>
		</div>
	</section>
</template>

<style scoped>
.hero {
	display: grid;
	grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
	align-items: center;
	gap: clamp(24px, 5vw, 72px);
	min-height: calc(100svh - var(--header-h));
	padding-block: clamp(32px, 6vw, 72px) clamp(56px, 8vw, 96px);
}

.kicker {
	margin: 0 0 20px;
}

.hero-name {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(3.6rem, 11.5vw, 9.25rem);
	font-weight: 620;
	line-height: 0.86;
	letter-spacing: -0.035em;
	font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 144;
}

.hero-name span {
	display: block;
}

.hero-name span + span {
	padding-left: 0.42em;
}

.lede {
	max-width: 32ch;
	margin: 28px 0 0;
	font-size: clamp(1.125rem, 1.6vw, 1.3rem);
	line-height: 1.55;
	color: var(--ink-soft);
}

.aside {
	white-space: nowrap;
	font-style: italic;
	color: var(--red-text);
}

.actions {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin-top: 36px;
}

/* The sun: a nod to "sunny (read: hot)" */
.hero-art {
	position: relative;
	display: grid;
	place-items: center;
	aspect-ratio: 1;
	width: min(100%, 460px);
	justify-self: center;
}

.sun {
	position: absolute;
	inset: 0;
	border-radius: 50%;
	background: var(--red);
	animation: rise 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.hero-stache {
	all: unset;
	position: relative;
	width: 72%;
	margin-top: 8%;
	cursor: pointer;
	border-radius: 20px;
	--stache: var(--on-red);
	-webkit-tap-highlight-color: transparent;
}

.hero-stache:focus-visible {
	outline: 2px solid var(--on-red);
	outline-offset: 6px;
}

.bubble {
	position: absolute;
	top: 2%;
	left: -6%;
	max-width: 220px;
	margin: 0;
	padding: 12px 14px;
	font-family: var(--font-mono);
	font-size: 0.78rem;
	line-height: 1.45;
	background: var(--paper-raised);
	border: 1.5px solid var(--ink);
	border-radius: 14px 14px 14px 4px;
	box-shadow: 4px 4px 0 var(--ink);
	opacity: 0;
	transform: translateY(8px) scale(0.96);
	transform-origin: 0 100%;
	transition:
		opacity 300ms ease,
		transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bubble.show {
	opacity: 1;
	transform: none;
}

@keyframes rise {
	from {
		transform: translateY(14%) scale(0.92);
		opacity: 0;
	}
}

@media (max-width: 860px) {
	.hero {
		grid-template-columns: 1fr;
		min-height: 0;
		padding-top: 24px;
	}

	.hero-art {
		order: -1;
		width: min(78vw, 360px);
	}

	.bubble {
		left: auto;
		right: -4%;
		top: -2%;
		max-width: 180px;
		border-radius: 14px 14px 4px 14px;
		transform-origin: 100% 100%;
	}
}

@media (prefers-reduced-motion: reduce) {
	.sun {
		animation: none;
	}

	.bubble {
		transition: opacity 200ms;
		transform: none;
	}
}
</style>
